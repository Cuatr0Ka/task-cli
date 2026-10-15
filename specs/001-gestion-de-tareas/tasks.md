---

description: "Lista de tareas para implementar la gestiÃ³n de tareas personales"
---

# Tareas: GestiÃ³n de tareas personales desde la terminal

**Entrada**: Documentos de diseÃ±o en `/specs/001-gestion-de-tareas/`

**Requisitos previos**: plan.md (obligatorio), spec.md (obligatorio para las historias de usuario), research.md, data-model.md, contracts/

**Pruebas**: Se incluyen tareas de pruebas porque la constituciÃ³n (principio IV) exige pruebas unitarias con Vitest para toda lÃ³gica de negocio.

**OrganizaciÃ³n**: Las tareas se agrupan por historia de usuario para poder implementar y probar cada una de forma independiente.

## Formato: `[ID] [P?] [Historia] DescripciÃ³n`

- **[P]**: Se puede ejecutar en paralelo (archivos distintos, sin dependencias)
- **[Historia]**: Historia de usuario a la que pertenece la tarea (US1, US2, ...)
- Cada descripciÃ³n incluye la ruta exacta del archivo

## Convenciones de rutas

- Proyecto Ãºnico: `src/` y `tests/` en la raÃ­z del repositorio, segÃºn plan.md
- Los identificadores, archivos y rutas van en inglÃ©s; comentarios, mensajes y nombres de pruebas en espaÃ±ol

---

## Fase 1: PreparaciÃ³n (infraestructura compartida)

**PropÃ³sito**: InicializaciÃ³n del proyecto y estructura bÃ¡sica

- [X] T001 Crear la estructura de carpetas `src/commands/`, `src/db/`, `src/utils/`, `tests/unit/` y `tests/commands/` segÃºn plan.md
- [X] T002 Inicializar `package.json` (mÃ³dulos ES, `bin: { "task-cli": "dist/index.js" }`, scripts `build`, `dev` y `test`) con dependencias `commander`, `better-sqlite3`, `cli-table3` y dependencias de desarrollo `typescript`, `tsx`, `vitest`, `@types/node`, `@types/better-sqlite3`
- [X] T003 [P] Crear `tsconfig.json` (salida en `dist/`, `strict` activado) en la raÃ­z
- [X] T004 [P] Crear `vitest.config.ts` en la raÃ­z y `.gitignore` con `node_modules/` y `dist/`

---

## Fase 2: Fundamentos (requisitos bloqueantes)

**PropÃ³sito**: Infraestructura bÃ¡sica que DEBE estar completa antes de cualquier historia de usuario

**âš ï¸ CRÃTICO**: No se puede empezar ninguna historia hasta terminar esta fase

- [X] T005 Definir los tipos `Task`, `TaskStatus` (`todo`, `in-progress`, `done`) y `TaskPriority` (`high`, `medium`, `low`) en `src/db/types.ts`
- [X] T006 Implementar la apertura de la base en `src/db/connection.ts`: ruta `~/.task-cli/tasks.db` (creando el directorio) o la de `TASK_CLI_DB`, y esquema `tasks` con `id INTEGER PRIMARY KEY AUTOINCREMENT`, `title TEXT NOT NULL CHECK (length(trim(title)) > 0)`, `description TEXT`, `status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','in-progress','done'))`, `priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high','medium','low'))` y `created_at TEXT NOT NULL`
- [X] T007 [P] Implementar `UserError` (tipo), `fail(mensaje)` y el manejador central de errores (mensaje en `stderr`, cÃ³digo de salida 1, sin stack trace) en `src/utils/errors.ts`
- [X] T008 [P] Implementar las funciones puras `parseId`, `parsePriority`, `parseStatus` y `validateTitle` (recorta el tÃ­tulo y rechaza vacÃ­os; los mensajes listan los valores vÃ¡lidos) en `src/utils/validation.ts`
- [X] T009 [P] Escribir pruebas unitarias de validaciÃ³n en `tests/unit/validation.test.ts` (tÃ­tulos vacÃ­os o solo espacios, prioridad invÃ¡lida, ID no numÃ©rico, negativo o cero)
- [X] T010 Crear el programa Commander con la ayuda en espaÃ±ol y el manejo central de errores en `src/index.ts` (con shebang `#!/usr/bin/env node`)

**Punto de control**: Base lista; ya se pueden implementar las historias de usuario

---

## Fase 3: Historia de usuario 1 - Crear tareas (Prioridad: P1) ðŸŽ¯ MVP

**Objetivo**: Crear tareas con tÃ­tulo obligatorio, prioridad y descripciÃ³n opcionales.

**Prueba independiente**: `add "Comprar leche"` crea la tarea 1 con estado `todo` y prioridad `medium`; `add ""` falla con cÃ³digo de salida 1.

### Pruebas de la historia de usuario 1 âš ï¸

> **NOTA: Escribe estas pruebas primero y comprueba que FALLAN antes de implementar**

- [X] T011 [P] [US1] Escribir pruebas del comando `add` en `tests/commands/add.test.ts` (tÃ­tulo vÃ¡lido, prioridad por defecto `medium`, descripciÃ³n opcional, IDs autoincrementales, tÃ­tulo vacÃ­o rechazado, prioridad invÃ¡lida rechazada)

### ImplementaciÃ³n de la historia de usuario 1

- [X] T012 [US1] Implementar `insertTask` en `src/db/tasks.ts` (estado inicial `todo`, `created_at` en ISO 8601 UTC)
- [X] T013 [US1] Implementar el comando `add <tÃ­tulo>` con `-p, --priority` y `-d, --description` en `src/commands/add.ts`; Ã©xito: `Tarea <id> creada: <tÃ­tulo>`
- [X] T014 [US1] Registrar el comando `add` en `src/index.ts`

**Punto de control**: La historia 1 es funcional y se puede probar sola

---

## Fase 4: Historia de usuario 2 - Listar y ver tareas (Prioridad: P1)

**Objetivo**: Ver las tareas en una tabla, filtrarlas por estado y prioridad, y consultar el detalle de una tarea.

**Prueba independiente**: Con varias tareas, `list` muestra la tabla con las mÃ¡s recientes primero, los filtros funcionan y `show <id>` muestra la descripciÃ³n completa.

### Pruebas de la historia de usuario 2 âš ï¸

- [X] T015 [P] [US2] Escribir pruebas unitarias de `truncateTitle` y del formato de fecha local `AAAA-MM-DD HH:mm` en `tests/unit/format.test.ts`
- [X] T016 [P] [US2] Escribir pruebas de `list` y `show` en `tests/commands/list.test.ts` (orden descendente por fecha, filtro por estado, filtro por prioridad, filtros combinados, lista vacÃ­a, filtro invÃ¡lido, ID inexistente)

### ImplementaciÃ³n de la historia de usuario 2

- [X] T017 [P] [US2] Implementar en `src/utils/format.ts` `truncateTitle` (trunca con "â€¦"), el formato de fecha local, los colores ANSI solo para estado y prioridad (desactivados con `NO_COLOR` o sin TTY) y la construcciÃ³n de la tabla con `cli-table3`
- [X] T018 [US2] Implementar `listTasks` (con filtros opcionales y `ORDER BY created_at DESC, id DESC`) y `getTaskById` en `src/db/tasks.ts`
- [X] T019 [US2] Implementar el comando `list` con `--status` y `--priority` en `src/commands/list.ts`; sin resultados: `No se encontraron tareas.`
- [X] T020 [US2] Implementar el comando `show <id>` en `src/commands/show.ts` (ID, tÃ­tulo completo, descripciÃ³n, estado, prioridad y fecha de creaciÃ³n)
- [X] T021 [US2] Registrar los comandos `list` y `show` en `src/index.ts`

**Punto de control**: Las historias 1 y 2 funcionan juntas (producto mÃ­nimo viable)

---

## Fase 5: Historia de usuario 3 - Cambiar el estado de una tarea (Prioridad: P2)

**Objetivo**: Cambiar el estado siguiendo solo las transiciones vÃ¡lidas.

**Prueba independiente**: Cada transiciÃ³n vÃ¡lida se aplica y `todo â†’ done` se rechaza sin modificar la tarea.

### Pruebas de la historia de usuario 3 âš ï¸

- [X] T022 [P] [US3] Escribir pruebas unitarias de transiciones en `tests/unit/transitions.test.ts` (`todo â†’ in-progress`, `in-progress â†’ done`, `in-progress â†’ todo`, `done â†’ todo` vÃ¡lidas; `todo â†’ done` y `done â†’ in-progress` invÃ¡lidas; mismo estado)
- [X] T023 [P] [US3] Escribir pruebas del comando `status` en `tests/commands/status.test.ts` (transiciÃ³n vÃ¡lida, transiciÃ³n invÃ¡lida sin cambios, ID inexistente, estado invÃ¡lido)

### ImplementaciÃ³n de la historia de usuario 3

- [X] T024 [P] [US3] Implementar la funciÃ³n pura `canTransition` y el mensaje de error de transiciÃ³n (por ejemplo, "Debe pasar primero por in-progress") en `src/utils/transitions.ts`
- [X] T025 [US3] Implementar `updateTaskStatus` en `src/db/tasks.ts`
- [X] T026 [US3] Implementar el comando `status <id> <estado>` en `src/commands/status.ts`; Ã©xito: `Tarea <id>: <anterior> â†’ <nuevo>`; si ya tiene ese estado, informarlo sin modificar nada
- [X] T027 [US3] Registrar el comando `status` en `src/index.ts`

**Punto de control**: Las historias 1, 2 y 3 funcionan de forma independiente

---

## Fase 6: Historia de usuario 4 - Actualizar una tarea (Prioridad: P3)

**Objetivo**: Modificar tÃ­tulo, descripciÃ³n o prioridad sin alterar los demÃ¡s campos.

**Prueba independiente**: `update 2 -t "Nuevo" -p low` cambia solo esos campos.

### Pruebas de la historia de usuario 4 âš ï¸

- [X] T028 [P] [US4] Escribir pruebas del comando `update` en `tests/commands/update.test.ts` (cambio de un campo, varios campos, tÃ­tulo vacÃ­o rechazado, sin campos indicados, ID inexistente)

### ImplementaciÃ³n de la historia de usuario 4

- [X] T029 [US4] Implementar `updateTaskFields` en `src/db/tasks.ts` (solo actualiza los campos indicados)
- [X] T030 [US4] Implementar el comando `update <id>` con `-t, --title`, `-d, --description` y `-p, --priority` en `src/commands/update.ts`; Ã©xito: `Tarea <id> actualizada.`; sin campos: `No hay cambios que aplicar`
- [X] T031 [US4] Registrar el comando `update` en `src/index.ts`

**Punto de control**: Las historias 1 a 4 funcionan de forma independiente

---

## Fase 7: Historia de usuario 5 - Eliminar una tarea (Prioridad: P3)

**Objetivo**: Eliminar una tarea pidiendo confirmaciÃ³n, salvo con `--force`.

**Prueba independiente**: `delete 2` con `n` conserva la tarea; `delete 2 --force` la elimina sin preguntar.

### Pruebas de la historia de usuario 5 âš ï¸

- [X] T032 [P] [US5] Escribir pruebas del comando `delete` en `tests/commands/delete.test.ts` (confirmaciÃ³n afirmativa, negativa, `--force`, sin terminal interactiva cuenta como no confirmado, ID inexistente, el ID eliminado no se reutiliza)

### ImplementaciÃ³n de la historia de usuario 5

- [X] T033 [P] [US5] Implementar la confirmaciÃ³n `Â¿Eliminar la tarea <id>? (s/N)` con `node:readline` (solo `s` o `S` confirma; sin TTY devuelve falso) en `src/utils/confirm.ts`
- [X] T034 [US5] Implementar `deleteTask` en `src/db/tasks.ts`
- [X] T035 [US5] Implementar el comando `delete <id>` con `--force` en `src/commands/delete.ts`; Ã©xito: `Tarea <id> eliminada.`; cancelado: `OperaciÃ³n cancelada.` con cÃ³digo 0
- [X] T036 [US5] Registrar el comando `delete` en `src/index.ts`

**Punto de control**: Todas las historias de usuario funcionan de forma independiente

---

## Fase 8: Pulido y asuntos transversales

**PropÃ³sito**: Mejoras que afectan a varias historias

- [X] T037 [P] Escribir el `README.md` en espaÃ±ol con instalaciÃ³n, uso de cada comando y ejemplos
- [X] T038 Comprobar que ningÃºn error muestra un stack trace y que todos los errores devuelven el cÃ³digo de salida 1 (incluidas las opciones desconocidas de Commander) en `src/utils/errors.ts` y `src/index.ts`
- [X] T039 Verificar el rendimiento de `list` con 1 000 tareas (menos de 1 segundo, SC-003) con una prueba en `tests/commands/list.test.ts`
- [ ] T040 Ejecutar `npm run build`, instalar con `npm install -g .` y validar `specs/001-gestion-de-tareas/quickstart.md`

---

## Dependencias y orden de ejecuciÃ³n

### Dependencias entre fases

- **PreparaciÃ³n (Fase 1)**: Sin dependencias; puede empezar de inmediato
- **Fundamentos (Fase 2)**: Depende de la Fase 1; BLOQUEA todas las historias
- **Historias de usuario (Fase 3 en adelante)**: Todas dependen de la Fase 2
  - Se pueden hacer en paralelo o por prioridad (P1 â†’ P2 â†’ P3)
- **Pulido (Fase 8)**: Depende de las historias deseadas

### Dependencias entre historias

- **US1 (P1)**: Sin dependencias de otras historias
- **US2 (P1)**: Para probarla con datos usa `insertTask` de US1 (T012); por lo demÃ¡s es independiente
- **US3 (P2)**: Usa `insertTask` y `getTaskById` para preparar datos en las pruebas
- **US4 (P3)**: Igual que US3
- **US5 (P3)**: Igual que US3

### Dentro de cada historia

- Las pruebas se escriben primero y deben FALLAR antes de implementar
- Consultas de base de datos antes que comandos, y comandos antes de registrarlos en `src/index.ts`
- Los archivos compartidos (`src/db/tasks.ts`, `src/index.ts`) se editan en secuencia, no en paralelo

### Oportunidades de paralelismo

- T003 y T004 en la Fase 1
- T007, T008 y T009 en la Fase 2
- Las pruebas de cada historia marcadas [P]
- T017 (formato) en paralelo con T018 (consultas)
- Tras la Fase 2, las historias pueden avanzar en paralelo coordinando las ediciones de `src/db/tasks.ts` y `src/index.ts`

---

## Ejemplo de paralelismo: historia de usuario 2

```bash
# Lanzar juntas las pruebas de la historia 2:
Tarea: "Pruebas de truncateTitle y fecha en tests/unit/format.test.ts"
Tarea: "Pruebas de list y show en tests/commands/list.test.ts"

# Lanzar juntas las piezas independientes:
Tarea: "Utilidades de formato en src/utils/format.ts"
Tarea: "Consultas listTasks y getTaskById en src/db/tasks.ts"
```

---

## Estrategia de implementaciÃ³n

### Primero el MVP (solo US1 y US2)

1. Completar la Fase 1: PreparaciÃ³n
2. Completar la Fase 2: Fundamentos (crÃ­tico)
3. Completar las Fases 3 y 4: crear y listar tareas
4. **DETENERSE Y VALIDAR**: probar crear y listar de forma independiente
5. Mostrar o publicar si estÃ¡ listo

### Entrega incremental

1. PreparaciÃ³n + Fundamentos â†’ base lista
2. AÃ±adir US1 y US2 â†’ probar â†’ MVP
3. AÃ±adir US3 â†’ probar
4. AÃ±adir US4 y US5 â†’ probar
5. Cada historia aporta valor sin romper las anteriores

---

## Notas

- [P] = archivos distintos, sin dependencias
- La etiqueta [Historia] vincula cada tarea con su historia para la trazabilidad
- Verifica que las pruebas fallen antes de implementar
- Haz un commit tras cada tarea o grupo lÃ³gico, con el formato `tipo(alcance): descripciÃ³n en espaÃ±ol`
- Evita tareas vagas, conflictos en el mismo archivo y dependencias entre historias que rompan su independencia






