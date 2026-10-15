import { beforeEach, describe, expect, it } from 'vitest';
import { openDb, type Db } from '../../src/db/connection.js';
import { getTaskById } from '../../src/db/tasks.js';
import { runAdd } from '../../src/commands/add.js';
import { runUpdate } from '../../src/commands/update.js';

let db: Db;

beforeEach(() => {
  db = openDb(':memory:');
  runAdd(db, 'Original', { priority: 'high', description: 'Descripción original' });
});

describe('comando update', () => {
  it('cambia_solo_el_titulo_sin_alterar_los_demas_campos', () => {
    const mensaje = runUpdate(db, '1', { title: 'Nuevo título' });
    const tarea = getTaskById(db, 1);
    expect(mensaje, 'debe confirmar').toBe('Tarea 1 actualizada.');
    expect(tarea?.title, 'el título debe cambiar').toBe('Nuevo título');
    expect(tarea?.priority, 'la prioridad no debe cambiar').toBe('high');
    expect(tarea?.description, 'la descripción no debe cambiar').toBe('Descripción original');
  });

  it('cambia_descripcion_y_prioridad_a_la_vez', () => {
    runUpdate(db, '1', { description: 'Otra', priority: 'low' });
    const tarea = getTaskById(db, 1);
    expect(tarea?.description, 'la descripción debe cambiar').toBe('Otra');
    expect(tarea?.priority, 'la prioridad debe cambiar').toBe('low');
    expect(tarea?.title, 'el título no debe cambiar').toBe('Original');
  });

  it('rechaza_un_titulo_vacio_sin_modificar_la_tarea', () => {
    expect(() => runUpdate(db, '1', { title: '  ' }), 'título vacío').toThrow('El título no puede estar vacío');
    expect(getTaskById(db, 1)?.title, 'el título no debe cambiar').toBe('Original');
  });

  it('rechaza_una_prioridad_invalida', () => {
    expect(() => runUpdate(db, '1', { priority: 'urgente' }), 'prioridad inválida').toThrow('high, medium, low');
  });

  it('informa_cuando_no_se_indica_ningun_campo', () => {
    expect(() => runUpdate(db, '1', {}), 'sin campos').toThrow('No hay cambios que aplicar');
  });

  it('informa_cuando_la_tarea_no_existe', () => {
    expect(() => runUpdate(db, '99', { title: 'X' }), 'ID inexistente').toThrow('La tarea 99 no existe');
  });
});
