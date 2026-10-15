# Modelo de datos: Gestión de tareas personales

## Entidad: Tarea (`tasks`)

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | entero | Clave primaria autoincremental; nunca se reutiliza (FR-003) |
| `title` | texto | Obligatorio; se recorta; no puede quedar vacío (FR-001) |
| `description` | texto, opcional | Sin límite definido; `NULL` si no se indicó |
| `status` | texto | Uno de `todo`, `in-progress`, `done`; inicial `todo` (FR-004) |
| `priority` | texto | Uno de `high`, `medium`, `low`; por defecto `medium` (FR-002) |
| `created_at` | texto | Fecha ISO 8601 UTC, asignada al crear (FR-004) |

### Esquema

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL CHECK (length(trim(title)) > 0),
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'todo'   CHECK (status IN ('todo','in-progress','done')),
  priority    TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  created_at  TEXT NOT NULL
);
```

## Transiciones de estado (FR-009)

| Desde | Hacia | Válida |
|---|---|---|
| todo | in-progress | Sí |
| in-progress | done | Sí |
| in-progress | todo | Sí (devolver al backlog) |
| done | todo | Sí (reabrir) |
| todo | done | No: debe pasar antes por `in-progress` |
| done | in-progress | No |
| cualquiera | el mismo estado | No cambia; se informa que ya está en ese estado |

## Validaciones

- El título se recorta (`trim`) y no puede estar vacío al crear ni al actualizar.
- Prioridad y estado se validan contra los valores permitidos; el mensaje de error lista los válidos.
- El ID debe ser un entero positivo; si no existe, se informa que la tarea no existe.
- Actualizar sin ningún campo indicado informa que no hay cambios.
