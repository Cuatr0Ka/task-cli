import { describe, expect, it } from 'vitest';
import { canTransition, transitionError } from '../../src/utils/transitions.js';

describe('canTransition', () => {
  it.each([
    ['todo', 'in-progress'],
    ['in-progress', 'done'],
    ['in-progress', 'todo'],
    ['done', 'todo'],
  ] as const)('permite_la_transicion_%s_a_%s', (desde, hacia) => {
    expect(canTransition(desde, hacia), `${desde} → ${hacia} debe ser válida`).toBe(true);
  });

  it.each([
    ['todo', 'done'],
    ['done', 'in-progress'],
  ] as const)('rechaza_la_transicion_%s_a_%s', (desde, hacia) => {
    expect(canTransition(desde, hacia), `${desde} → ${hacia} debe ser inválida`).toBe(false);
  });

  it('rechaza_pasar_al_mismo_estado', () => {
    expect(canTransition('todo', 'todo'), 'el mismo estado no es una transición').toBe(false);
  });
});

describe('transitionError', () => {
  it('devuelve_null_si_la_transicion_es_valida', () => {
    expect(transitionError('todo', 'in-progress'), 'sin error').toBeNull();
  });

  it('explica_que_todo_a_done_debe_pasar_por_in_progress', () => {
    expect(transitionError('todo', 'done'), 'debe mencionar in-progress').toContain('in-progress');
  });
});
