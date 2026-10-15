import { beforeEach, describe, expect, it } from 'vitest';
import { openDb, type Db } from '../../src/db/connection.js';
import { getTaskById } from '../../src/db/tasks.js';
import { runAdd } from '../../src/commands/add.js';
import { runDelete } from '../../src/commands/delete.js';
import { confirm } from '../../src/utils/confirm.js';

let db: Db;
const siempre = async (): Promise<boolean> => true;
const nunca = async (): Promise<boolean> => false;
const noDebeLlamarse = async (): Promise<boolean> => {
  throw new Error('No debía pedir confirmación');
};

beforeEach(() => {
  db = openDb(':memory:');
  runAdd(db, 'Tarea', {});
});

describe('comando delete', () => {
  it('elimina_la_tarea_si_el_usuario_confirma', async () => {
    const mensaje = await runDelete(db, '1', {}, siempre);
    expect(mensaje, 'debe confirmar').toBe('Tarea 1 eliminada.');
    expect(getTaskById(db, 1), 'la tarea debe desaparecer').toBeUndefined();
  });

  it('conserva_la_tarea_si_el_usuario_rechaza', async () => {
    const mensaje = await runDelete(db, '1', {}, nunca);
    expect(mensaje, 'debe indicar cancelación').toBe('Operación cancelada.');
    expect(getTaskById(db, 1), 'la tarea debe conservarse').toBeDefined();
  });

  it('elimina_sin_preguntar_con_force', async () => {
    await runDelete(db, '1', { force: true }, noDebeLlamarse);
    expect(getTaskById(db, 1), 'la tarea debe eliminarse').toBeUndefined();
  });

  it('informa_cuando_la_tarea_no_existe', async () => {
    await expect(runDelete(db, '99', {}, siempre), 'ID inexistente').rejects.toThrow('La tarea 99 no existe');
  });

  it('no_reutiliza_el_id_de_una_tarea_eliminada', async () => {
    await runDelete(db, '1', { force: true }, noDebeLlamarse);
    runAdd(db, 'Nueva', {});
    expect(getTaskById(db, 2)?.title, 'la nueva tarea debe recibir el ID 2').toBe('Nueva');
    expect(getTaskById(db, 1), 'el ID 1 no debe reutilizarse').toBeUndefined();
  });
});

describe('confirm', () => {
  it('cuenta_como_no_confirmado_sin_terminal_interactiva', async () => {
    const original = process.stdin.isTTY;
    process.stdin.isTTY = false;
    try {
      expect(await confirm('¿Seguro? (s/N) '), 'sin TTY no se confirma').toBe(false);
    } finally {
      process.stdin.isTTY = original;
    }
  });
});
