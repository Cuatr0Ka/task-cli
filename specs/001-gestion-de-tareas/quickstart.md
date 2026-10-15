# Guía rápida de validación: task-cli

Guía para comprobar de extremo a extremo que la funcionalidad cumple la especificación. Los comandos están definidos en [contracts/cli-commands.md](contracts/cli-commands.md) y los datos en [data-model.md](data-model.md).

## Requisitos previos

- Node.js LTS y npm.
- Dependencias instaladas con `npm install`.
- Para no tocar tus datos, usa una base temporal: en PowerShell `$env:TASK_CLI_DB = "$env:TEMP\task-cli-prueba.db"`.

## Ejecución de las pruebas

```bash
npm test
```

Resultado esperado: todas las pruebas unitarias y de comandos pasan.

## Escenario de extremo a extremo

Se ejecuta con `npx tsx src/index.ts` (o `task-cli` tras `npm install -g .`).

1. `add "Comprar leche"` → crea la tarea 1 con estado `todo` y prioridad `medium`.
2. `add "Informe" -p high -d "Entrega del trimestre"` → crea la tarea 2.
3. `add ""` → error "El título no puede estar vacío", código de salida 1.
4. `list` → tabla con las tareas 2 y 1, la más reciente primero.
5. `list --priority high` → solo la tarea 2.
6. `show 2` → muestra la descripción completa.
7. `status 1 done` → error: debe pasar antes por `in-progress`.
8. `status 1 in-progress`, luego `status 1 done` → ambos funcionan; `status 1 todo` reabre la tarea.
9. `update 2 -t "Informe final" -p low` → actualiza título y prioridad.
10. `delete 2` y responder `n` → "Operación cancelada."; la tarea sigue en `list`.
11. `delete 2 --force` → elimina sin preguntar; `add "Nueva"` recibe el ID 3 (no reutiliza el 2).
12. `show 99` → error "La tarea 99 no existe", código de salida 1, sin stack trace.

## Instalación global

```bash
npm run build
npm install -g .
task-cli --help
```

Resultado esperado: la ayuda aparece en español.
