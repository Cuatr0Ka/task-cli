import { describe, expect, it } from 'vitest';
import { buildTable, colorPriority, colorStatus, formatDate, truncateTitle } from '../../src/utils/format.js';
import type { Task } from '../../src/db/types.js';

describe('truncateTitle', () => {
  it('no_modifica_un_titulo_que_cabe', () => {
    expect(truncateTitle('Corto', 10), 'un título corto no se toca').toBe('Corto');
  });

  it('trunca_con_puntos_suspensivos_un_titulo_largo', () => {
    const resultado = truncateTitle('Un título demasiado largo', 10);
    expect(resultado, 'debe terminar en …').toBe('Un título…');
    expect(resultado.length, 'no debe exceder el ancho máximo').toBeLessThanOrEqual(10);
  });
});

describe('formatDate', () => {
  it('formatea_la_fecha_en_hora_local', () => {
    const local = new Date(2026, 0, 5, 9, 7);
    expect(formatDate(local.toISOString()), 'formato AAAA-MM-DD HH:mm').toBe('2026-01-05 09:07');
  });
});

describe('colores', () => {
  it('no_agrega_codigos_ansi_si_el_color_esta_desactivado', () => {
    expect(colorStatus('done', false), 'sin color').toBe('done');
    expect(colorPriority('high', false), 'sin color').toBe('high');
  });

  it('agrega_codigos_ansi_si_el_color_esta_activado', () => {
    expect(colorStatus('done', true), 'con color').toContain('\x1b[');
    expect(colorPriority('high', true), 'con color').toContain('\x1b[');
  });
});

describe('buildTable', () => {
  const tarea: Task = {
    id: 1,
    title: 'T'.repeat(200),
    description: null,
    status: 'todo',
    priority: 'medium',
    createdAt: new Date().toISOString(),
  };

  it('trunca_los_titulos_largos_sin_romper_el_ancho', () => {
    const tabla = buildTable([tarea], 100, false);
    const anchos = tabla.split('\n').map((linea) => linea.length);
    expect(tabla, 'debe contener …').toContain('…');
    expect(Math.max(...anchos), 'ninguna línea debe exceder el ancho').toBeLessThanOrEqual(100);
  });
});
