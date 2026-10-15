import { describe, expect, it } from 'vitest';
import { parseId, parsePriority, parseStatus, validateTitle } from '../../src/utils/validation.js';

describe('validateTitle', () => {
  it('recorta los espacios de un título válido', () => {
    expect(validateTitle('  Comprar leche  '), 'debe recortar el título').toBe('Comprar leche');
  });

  it('rechaza un título vacío', () => {
    expect(() => validateTitle(''), 'un título vacío debe fallar').toThrow('El título no puede estar vacío');
  });

  it('rechaza un título formado solo por espacios', () => {
    expect(() => validateTitle('   '), 'solo espacios debe fallar').toThrow('El título no puede estar vacío');
  });
});

describe('parsePriority', () => {
  it('acepta high, medium y low', () => {
    expect(parsePriority('high')).toBe('high');
    expect(parsePriority('medium')).toBe('medium');
    expect(parsePriority('low')).toBe('low');
  });

  it('rechaza una prioridad inválida y lista los valores permitidos', () => {
    expect(() => parsePriority('urgente'), 'debe listar los valores válidos').toThrow('high, medium, low');
  });
});

describe('parseStatus', () => {
  it('acepta los tres estados válidos', () => {
    expect(parseStatus('todo')).toBe('todo');
    expect(parseStatus('in-progress')).toBe('in-progress');
    expect(parseStatus('done')).toBe('done');
  });

  it('rechaza un estado inválido y lista los valores permitidos', () => {
    expect(() => parseStatus('hecho'), 'debe listar los valores válidos').toThrow('todo, in-progress, done');
  });
});

describe('parseId', () => {
  it('acepta un entero positivo', () => {
    expect(parseId('7')).toBe(7);
  });

  it.each(['abc', '-1', '0', '1.5', ''])('rechaza el ID inválido "%s"', (valor) => {
    expect(() => parseId(valor), `el ID "${valor}" debe fallar`).toThrow('no es válido');
  });
});
