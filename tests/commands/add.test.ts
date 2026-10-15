import { beforeEach, describe, expect, it } from 'vitest';
import { openDb, type Db } from '../../src/db/connection.js';
import { getTaskById } from '../../src/db/tasks.js';
import { runAdd } from '../../src/commands/add.js';

let db: Db;

beforeEach(() => {
  db = openDb(':memory:');
});

describe('comando add', () => {
  it('agrega_tarea_con_titulo_valido', () => {
    const mensaje = runAdd(db, 'Comprar leche', {});
    const tarea = getTaskById(db, 1);
    expect(mensaje, 'debe confirmar la creación').toBe('Tarea 1 creada: Comprar leche');
    expect(tarea?.status, 'el estado inicial debe ser todo').toBe('todo');
  });

  it('usa_prioridad_medium_por_defecto', () => {
    runAdd(db, 'Tarea', {});
    expect(getTaskById(db, 1)?.priority, 'la prioridad por defecto debe ser medium').toBe('medium');
  });

  it('guarda_prioridad_y_descripcion_indicadas', () => {
    runAdd(db, 'Informe', { priority: 'high', description: 'Entrega del trimestre' });
    const tarea = getTaskById(db, 1);
    expect(tarea?.priority, 'debe conservar la prioridad').toBe('high');
    expect(tarea?.description, 'debe conservar la descripción').toBe('Entrega del trimestre');
  });

  it('asigna_ids_autoincrementales', () => {
    runAdd(db, 'Primera', {});
    runAdd(db, 'Segunda', {});
    expect(getTaskById(db, 2)?.title, 'la segunda tarea debe tener ID 2').toBe('Segunda');
  });

  it('rechaza_titulo_vacio_sin_crear_nada', () => {
    expect(() => runAdd(db, '  ', {}), 'el título vacío debe fallar').toThrow('El título no puede estar vacío');
    expect(getTaskById(db, 1), 'no debe crearse ninguna tarea').toBeUndefined();
  });

  it('rechaza_prioridad_invalida', () => {
    expect(() => runAdd(db, 'Tarea', { priority: 'urgente' }), 'debe listar valores válidos').toThrow('high, medium, low');
  });
});
