export type UserError = Error & { isUserError: true };

// Lanza un error pensado para el usuario final (mensaje claro, sin stack trace).
export function fail(message: string): never {
  const error = new Error(message) as UserError;
  error.isUserError = true;
  throw error;
}

export function isUserError(error: unknown): error is UserError {
  return error instanceof Error && (error as Partial<UserError>).isUserError === true;
}

// Traduce al español los mensajes de error de Commander.
export function translateCommanderMessage(message: string): string {
  const text = message.replace(/^error: /, '');
  const rules: [RegExp, (m: RegExpMatchArray) => string][] = [
    [/^unknown option '(.+)'/, (m) => `La opción "${m[1]}" no existe. Usa --help para ver las opciones.`],
    [/^unknown command '(.+)'/, (m) => `El comando "${m[1]}" no existe. Usa --help para ver los comandos.`],
    [/^missing required argument '(.+)'/, (m) => `Falta el argumento obligatorio "${m[1]}".`],
    [/^option '(.+)' argument missing/, (m) => `La opción "${m[1]}" necesita un valor.`],
    [/^too many arguments/, () => 'Se indicaron más argumentos de los esperados.'],
  ];
  for (const [pattern, build] of rules) {
    const match = text.match(pattern);
    if (match) {
      return build(match);
    }
  }
  return 'Los argumentos indicados no son válidos. Usa --help para ver la ayuda.';
}

// Manejador central: imprime el mensaje en stderr y termina con código 1.
export function handleError(error: unknown): never {
  if (isUserError(error)) {
    console.error(`Error: ${error.message}`);
  } else {
    console.error('Error: ocurrió un problema inesperado. Inténtalo de nuevo.');
  }
  process.exit(1);
}
