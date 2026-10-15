# Contrato de la CLI: `task-cli`

Todos los mensajes están en español. Los errores se escriben en `stderr` y el proceso termina con código 1; el éxito termina con código 0. Nunca se muestran stack traces.

## `task-cli add <título>`

| Opción | Descripción |
|---|---|
| `-p, --priority <high\|medium\|low>` | Prioridad (por defecto `medium`) |
| `-d, --description <texto>` | Descripción opcional |

- Éxito: `Tarea <id> creada: <título>`.
- Errores: título vacío; prioridad inválida (lista los valores válidos).

## `task-cli list`

| Opción | Descripción |
|---|---|
| `--status <todo\|in-progress\|done>` | Filtra por estado |
| `--priority <high\|medium\|low>` | Filtra por prioridad (combinable con `--status`) |

- Salida: tabla con columnas ID, Título, Estado, Prioridad, Creada; más recientes primero. Títulos largos truncados con "…". Color solo en Estado y Prioridad.
- Sin resultados: `No se encontraron tareas.`
- Errores: valor de filtro inválido.

## `task-cli show <id>`

- Salida: ID, título completo, descripción, estado, prioridad y fecha de creación.
- Errores: ID inválido o inexistente.

## `task-cli status <id> <estado>`

- Estados: `todo`, `in-progress`, `done`.
- Éxito: `Tarea <id>: <anterior> → <nuevo>`.
- Errores: ID inexistente; estado inválido; transición no válida (por ejemplo, `todo → done`: "Debe pasar primero por in-progress"). Si ya está en ese estado, se informa sin modificar nada.

## `task-cli update <id>`

| Opción | Descripción |
|---|---|
| `-t, --title <texto>` | Nuevo título |
| `-d, --description <texto>` | Nueva descripción |
| `-p, --priority <high\|medium\|low>` | Nueva prioridad |

- Éxito: `Tarea <id> actualizada.`
- Errores: ID inexistente; título vacío; prioridad inválida; ningún campo indicado ("No hay cambios que aplicar").

## `task-cli delete <id>`

| Opción | Descripción |
|---|---|
| `--force` | Omite la confirmación |

- Pregunta `¿Eliminar la tarea <id>? (s/N)`; solo `s` o `S` confirma. Sin terminal interactiva cuenta como no confirmado.
- Éxito: `Tarea <id> eliminada.`; si se cancela: `Operación cancelada.` (código 0).
- Errores: ID inexistente.

## Códigos de salida

| Código | Significado |
|---|---|
| 0 | Éxito, incluida una confirmación cancelada |
| 1 | Cualquier error de uso o de validación |
