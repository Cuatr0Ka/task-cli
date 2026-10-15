import { beforeEach, describe, expect, it } from 'vitest';
import { openDb, type Db } from '../../src/db/connection.js';
import { getTaskById } from '../../src/db/tasks.js';
import { runAdd } from '../../src/commands/add.js';
import { runStatus } from '../../src/commands/status.js';

let db: Db;

beforeEach(() => {
  db = openDb(':memory:');
  runAdd(db, 'Tarea', {});
});

describe('comando status', () => {
  it('aplica_una_transicion_valida', () => {
    const mensaje = runStatus(db, '1', 'in-progress');
    expect(mensaje, 'debe confirmar el cambio').toBe('Tarea 1: todo → in-progress');
    expect(getTaskById(db, 1)?.status, 'el estado debe cambiar').toBe('in-progress');
  });

  it('completa_y_reabre_una_tarea', () => {
    runStatus(db, '1', 'in-progress');
    runStatus(db, '1', 'done');
    expect(getTaskById(db, 1)?.status, 'debe quedar en done').toBe('done');
    runStatus(db, '1', 'todo');
    expect(getTaskById(db, 1)?.status, 'debe reabrirse en todo').toBe('todo');
  });

  it('devuelve_una_tarea_en_progreso_al_backlog', () => {
    runStatus(db, '1', 'in-progress');
    runStatus(db, '1', 'todo');
    expect(getTaskById(db, 1)?.status, 'debe volver a todo').toBe('todo');
  });

  it('rechaza_todo_a_done_sin_modificar_la_tarea', () => {
    expect(() => runStatus(db, '1', 'done'), 'debe mencionar in-progress').toThrow('in-progress');
    expect(getTaskById(db, 1)?.status, 'el estado no debe cambiar').toBe('todo');
  });

  it('informa_si_la_tarea_ya_tiene_ese_estado', () => {
    expect(runStatus(db, '1', 'todo'), 'mensaje informativo').toBe('La tarea 1 ya está en estado todo.');
  });

  it('informa_cuando_la_tarea_no_existe', () => {
    expect(() => runStatus(db, '99', 'in-progress'), 'ID inexistente').toThrow('La tarea 99 no existe');
  });

  it('rechaza_un_estado_invalido', () => {
    expect(() => runStatus(db, '1', 'hecho'), 'estado inválido').toThrow('todo, in-progress, done');
  });
});
