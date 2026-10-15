import { describe, expect, it } from 'vitest';
import { fail, isUserError, translateCommanderMessage } from '../../src/utils/errors.js';

describe('fail', () => {
  it('lanza_un_error_de_usuario_con_el_mensaje_indicado', () => {
    try {
      fail('Algo salió mal');
      expect.unreachable('fail debía lanzar');
    } catch (error) {
      expect(isUserError(error), 'debe ser un error de usuario').toBe(true);
      expect((error as Error).message, 'debe conservar el mensaje').toBe('Algo salió mal');
    }
  });

  it('no_considera_error_de_usuario_a_un_error_comun', () => {
    expect(isUserError(new Error('interno')), 'un Error común no es de usuario').toBe(false);
  });
});

describe('translateCommanderMessage', () => {
  it.each([
    ["error: unknown option '--x'", 'La opción "--x" no existe'],
    ["error: unknown command 'foo'", 'El comando "foo" no existe'],
    ["error: missing required argument 'id'", 'Falta el argumento obligatorio "id"'],
    ["error: option '-p, --priority <prioridad>' argument missing", 'necesita un valor'],
    ["error: too many arguments for 'add'. Expected 1 argument but got 2.", 'más argumentos'],
  ])('traduce_%s', (original, esperado) => {
    expect(translateCommanderMessage(original), 'el mensaje debe estar en español').toContain(esperado);
  });
});
