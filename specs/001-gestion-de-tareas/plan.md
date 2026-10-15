# Plan de implementación: Gestión de tareas personales desde la terminal

**Rama**: `001-gestion-de-tareas` | **Fecha**: 2026-10-14 | **Especificación**: [spec.md](spec.md)

**Entrada**: Especificación de la funcionalidad en `/specs/001-gestion-de-tareas/spec.md`

## Resumen

CLI `task-cli` para crear, listar, consultar, actualizar, cambiar de estado y eliminar tareas personales. Las tareas se guardan en una base SQLite local. El enfoque técnico es TypeScript funcional con Commander.js para los comandos, `better-sqlite3` para el acceso directo a datos (sin ORM) y `cli-table3` para las tablas. La lógica de negocio (validación y transiciones de estado) se aísla en funciones puras probadas con Vitest.

## Contexto técnico

**Lenguaje/Versión**: TypeScript sobre Node.js LTS (módulos ES)

**Dependencias principales**: `commander`, `better-sqlite3`, `cli-table3`

**Almacenamiento**: SQLite en `~/.task-cli/tasks.db` (ruta reemplazable con la variable de entorno `TASK_CLI_DB`, usada en las pruebas)

**Pruebas**: Vitest (unitarias; pruebas de comandos con una base temporal)

**Plataforma de destino**: Terminal en Windows, macOS y Linux

**Tipo de proyecto**: CLI instalable globalmente con `npm install -g`

**Metas de rendimiento**: listado de 1 000 tareas en menos de 1 segundo (SC-003)

**Restricciones**: sin ORM, sin dependencias innecesarias, sin stack traces visibles, códigos de salida 0/1

**Escala/Alcance**: uso personal, un usuario, hasta miles de tareas

## Verificación de la constitución

*PUERTA: debe pasar antes de la investigación de la Fase 0. Se vuelve a comprobar tras el diseño de la Fase 1.*

| Principio / restricción | Cumplimiento |
|---|---|
| I. Simplicidad y estructura plana (`commands/`, `db/`, `utils/`, sin ORM) | Cumple: estructura plana por funcionalidad y SQL directo |
| II. Estilo funcional (`camelCase`, `PascalCase` solo en tipos) | Cumple: solo funciones y tipos, sin clases |
| III. Errores claros, sin stack traces, salida 0/1 | Cumple: un manejador central convierte errores en mensajes y código 1 |
| IV. Pruebas de la lógica de negocio con Vitest | Cumple: validación y transiciones en funciones puras con pruebas |
| V. Salida legible con tablas y colores solo en estado/prioridad | Cumple: `cli-table3`; color solo en esas dos columnas |
| Restricciones técnicas (Node LTS, `better-sqlite3`, Commander.js, instalación global) | Cumple |
| Flujo: español en comentarios y mensajes, inglés en identificadores | Cumple |

**Resultado**: sin violaciones; no se requiere seguimiento de complejidad. Tras el diseño de la Fase 1 se mantiene el mismo resultado.

## Estructura del proyecto

### Documentación (esta funcionalidad)

```text
specs/001-gestion-de-tareas/
├── plan.md              # Este archivo (salida de /speckit-plan)
├── research.md          # Salida de la Fase 0
├── data-model.md        # Salida de la Fase 1
├── quickstart.md        # Salida de la Fase 1
├── contracts/           # Salida de la Fase 1
│   └── cli-commands.md
└── tasks.md             # Salida de la Fase 2 (/speckit-tasks; NO lo crea /speckit-plan)
```

### Código fuente (raíz del repositorio)

```text
src/
├── index.ts             # Punto de entrada: define el programa Commander
├── commands/
│   ├── add.ts
│   ├── list.ts
│   ├── show.ts
│   ├── status.ts
│   ├── update.ts
│   └── delete.ts
├── db/
│   ├── connection.ts    # Apertura de la base y creación del esquema
│   └── tasks.ts         # Consultas SQL sobre tareas
└── utils/
    ├── validation.ts    # Validación de título, prioridad, estado e ID (puro)
    ├── transitions.ts   # Transiciones de estado válidas (puro)
    ├── format.ts        # Tabla, truncado de títulos, color y fechas
    ├── errors.ts        # Errores de usuario y manejador central
    └── confirm.ts       # Confirmación interactiva de borrado

tests/
├── unit/                # validation, transitions, format
└── commands/            # comandos contra una base temporal
```

**Decisión de estructura**: proyecto único y plano, organizado por funcionalidad según la constitución. Se compila con `tsc` a `dist/` para la instalación global (`bin` apunta a `dist/index.js`) y se ejecuta en desarrollo con `tsx`.

## Seguimiento de complejidad

Sin violaciones de la constitución que justificar.
