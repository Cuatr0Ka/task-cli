import { beforeEach, describe, expect, it } from 'vitest';
import { openDb, type Db } from '../../src/db/connection.js';
import { runAdd } from '../../src/commands/add.js';
import { runList } from '../../src/commands/list.js';
import { runShow } from '../../src/commands/show.js';

let db: Db;

beforeEach(() => {
  db = openDb(':memory:');
  runAdd(db, 'Primera', { priority: 'low' });
  runAdd(db, 'Segunda', { priority: 'high' });
  runAdd(db, 'Tercera', { priority: 'high', description: 'Detalle largo de la tercera' });
  db.prepare("UPDATE tasks SET status = 'in-progress' WHERE id = 2").run();
});

const listar = (opciones: { status?: string; priority?: string } = {}): string => runList(db, opciones, 120, false);

describe('comando list', () => {
  it('muestra_la_tabla_con_las_mas_recientes_primero', () => {
    const salida = listar();
    expect(salida, 'debe incluir el encabezado Título').toContain('Título');
    expect(salida.indexOf('Tercera'), 'la más reciente va primero').toBeLessThan(salida.indexOf('Segunda'));
    expect(salida.indexOf('Segunda'), 'la más antigua va última').toBeLessThan(salida.indexOf('Primera'));
  });

  it('filtra_por_estado', () => {
    const salida = listar({ status: 'in-progress' });
    expect(salida, 'debe mostrar la tarea en progreso').toContain('Segunda');
    expect(salida, 'no debe mostrar otras').not.toContain('Primera');
  });

  it('filtra_por_prioridad', () => {
    const salida = listar({ priority: 'high' });
    expect(salida, 'debe mostrar las de prioridad alta').toContain('Tercera');
    expect(salida, 'no debe mostrar las de prioridad baja').not.toContain('Primera');
  });

  it('combina_filtros_de_estado_y_prioridad', () => {
    const salida = listar({ status: 'todo', priority: 'high' });
    expect(salida, 'solo cumple ambos la tercera').toContain('Tercera');
    expect(salida, 'la segunda no está en todo').not.toContain('Segunda');
  });

  it('informa_cuando_no_hay_tareas_coincidentes', () => {
    expect(listar({ status: 'done' }), 'mensaje de lista vacía').toBe('No se encontraron tareas.');
  });

  it('rechaza_un_filtro_invalido', () => {
    expect(() => listar({ status: 'hecho' }), 'estado inválido').toThrow('todo, in-progress, done');
    expect(() => listar({ priority: 'urgente' }), 'prioridad inválida').toThrow('high, medium, low');
  });
});

describe('rendimiento de list', () => {
  it('lista_1000_tareas_en_menos_de_un_segundo', () => {
    const insertar = db.prepare("INSERT INTO tasks (title, created_at) VALUES (?, ?)");
    db.transaction(() => {
      for (let i = 0; i < 1000; i++) {
        insertar.run(`Tarea ${i}`, new Date().toISOString());
      }
    })();
    const inicio = performance.now();
    listar();
    expect(performance.now() - inicio, 'el listado debe tardar menos de 1000 ms').toBeLessThan(1000);
  });
});

describe('comando show', () => {
  it('muestra_el_detalle_completo_con_la_descripcion', () => {
    const salida = runShow(db, '3');
    expect(salida, 'debe mostrar la descripción').toContain('Detalle largo de la tercera');
    expect(salida, 'debe mostrar el título').toContain('Tercera');
    expect(salida, 'debe mostrar el estado').toContain('todo');
  });

  it('informa_cuando_la_tarea_no_existe', () => {
    expect(() => runShow(db, '99'), 'ID inexistente').toThrow('La tarea 99 no existe');
  });

  it('rechaza_un_id_invalido', () => {
    expect(() => runShow(db, 'abc'), 'ID no numérico').toThrow('no es válido');
  });
});
