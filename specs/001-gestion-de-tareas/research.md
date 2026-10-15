# Investigación: Gestión de tareas personales

No quedan marcadores `NEEDS CLARIFICATION` en el contexto técnico. Estas son las decisiones tomadas.

## D1. Distribución instalable globalmente

- **Decisión**: compilar con `tsc` a `dist/`, con `bin: { "task-cli": "dist/index.js" }` y shebang `#!/usr/bin/env node`. En desarrollo se usa `tsx`.
- **Justificación**: `npm install -g` necesita JavaScript ejecutable sin depender de `tsx` en tiempo de ejecución.
- **Alternativas**: ejecutar con `tsx` en producción (agrega una dependencia de runtime y arranque más lento).

## D2. Identificadores sin reutilización

- **Decisión**: `INTEGER PRIMARY KEY AUTOINCREMENT`.
- **Justificación**: SQLite garantiza con `AUTOINCREMENT` que no se reutilizan IDs de filas eliminadas (FR-003).
- **Alternativas**: `INTEGER PRIMARY KEY` simple, que puede reutilizar el ID máximo tras borrar.

## D3. Fechas

- **Decisión**: guardar la fecha de creación en ISO 8601 UTC y mostrarla en hora local con formato `AAAA-MM-DD HH:mm`.
- **Justificación**: orden cronológico correcto, sin ambigüedad de zona horaria.
- **Alternativas**: guardar hora local (ambiguo al cambiar de zona).

## D4. Orden de los listados

- **Decisión**: `ORDER BY created_at DESC, id DESC`.
- **Justificación**: dos tareas creadas en el mismo instante conservan un orden estable.

## D5. Confirmación de borrado

- **Decisión**: `node:readline` con pregunta `s/N`. Sin terminal interactiva (`process.stdin.isTTY` falso) se trata como no confirmado.
- **Justificación**: cubre el caso límite de la especificación sin agregar librerías (constitución, principio I).
- **Alternativas**: `inquirer` o `prompts` (dependencia innecesaria).

## D6. Colores

- **Decisión**: códigos ANSI propios en `format.ts`, aplicados solo a estado y prioridad; se desactivan si `NO_COLOR` está definido o no hay TTY.
- **Justificación**: son pocas líneas, evita una dependencia (principio I) y cumple el principio V.
- **Alternativas**: `chalk` o `picocolors`.

## D7. Tablas y truncado

- **Decisión**: `cli-table3` con anchos de columna fijos; el título se trunca con "…" mediante una función propia pura, según el ancho de la terminal.
- **Justificación**: la constitución sugiere `cli-table3`; el truncado propio es comprobable con pruebas unitarias (FR-015).

## D8. Manejo de errores

- **Decisión**: sin clases: una función `fail(mensaje)` lanza un objeto de error de usuario (`UserError`, un tipo); un manejador central en `index.ts` imprime el mensaje en `stderr` y termina con código 1. Los errores inesperados muestran un mensaje genérico sin stack trace.
- **Justificación**: principio III. Los errores de Commander (opciones desconocidas) también se redirigen al mismo manejador.

## D9. Aislamiento en pruebas

- **Decisión**: la ruta de la base se toma de `TASK_CLI_DB` si existe; las pruebas usan una base temporal o `:memory:`.
- **Justificación**: pruebas deterministas sin tocar `~/.task-cli/tasks.db`.

## D10. Nombres de comandos

- **Decisión**: `add`, `list`, `show`, `status`, `update`, `delete`. Detalle en [contracts/cli-commands.md](contracts/cli-commands.md).
- **Justificación**: nombres cortos y habituales; `show` cubre el detalle aclarado en la sesión de clarificación.
