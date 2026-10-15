# task-cli

CLI para gestionar tareas personales desde la terminal, construido con TypeScript y SQLite.

## Requisitos

- Node.js LTS (20 o superior)

## Instalación

```bash
npm install
npm run build
npm install -g .
```

Tras la instalación global, el comando `task-cli` queda disponible en la terminal.

Las tareas se guardan en `~/.task-cli/tasks.db`. Para usar otra ubicación, define la variable de entorno `TASK_CLI_DB`.

## Uso

| Comando | Descripción |
|---|---|
| `task-cli add <título> [-p prioridad] [-d descripción]` | Crea una tarea (prioridad por defecto: `medium`) |
| `task-cli list [--status estado] [--priority prioridad]` | Lista las tareas en una tabla, las más recientes primero |
| `task-cli show <id>` | Muestra el detalle completo de una tarea |
| `task-cli status <id> <estado>` | Cambia el estado de una tarea |
| `task-cli update <id> [-t título] [-d descripción] [-p prioridad]` | Modifica una tarea |
| `task-cli delete <id> [--force]` | Elimina una tarea (pide confirmación salvo con `--force`) |

Valores válidos:

- Estados: `todo`, `in-progress`, `done`
- Prioridades: `high`, `medium`, `low`

### Transiciones de estado

| Desde | Hacia |
|---|---|
| `todo` | `in-progress` |
| `in-progress` | `done`, `todo` |
| `done` | `todo` |

No se puede pasar de `todo` a `done` directamente: la tarea debe pasar antes por `in-progress`.

### Ejemplos

```bash
task-cli add "Informe trimestral" -p high -d "Entrega el viernes"
task-cli list --priority high
task-cli status 1 in-progress
task-cli show 1
task-cli delete 1 --force
```

## Códigos de salida

- `0`: éxito (incluye una eliminación cancelada)
- `1`: error de uso o de validación; el mensaje se muestra en español y nunca un stack trace

## Desarrollo

```bash
npm run dev -- list   # ejecuta el CLI con tsx
npm test              # pruebas con Vitest
npm run build         # compila a dist/
```

La estructura del código es `src/commands/` (un archivo por comando), `src/db/` (acceso a SQLite) y `src/utils/` (validación, formato, errores).

## Fuera de alcance

Usuarios y autenticación, sincronización externa, fechas de vencimiento, subtareas, tags y categorías, interfaz web y API REST.
