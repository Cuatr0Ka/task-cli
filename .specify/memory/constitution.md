<!--
Informe de impacto de la sincronización
- Cambio de versión: (plantilla sin completar) → 1.0.0
- Principios modificados: ninguno renombrado (todos son nuevos respecto a la plantilla)
- Secciones añadidas: Principios fundamentales (I–V), Restricciones técnicas, Flujo de desarrollo, Gobernanza
- Secciones eliminadas: ninguna
- TODOs pendientes: ninguno
-->
# Constitución de task-cli

## Principios fundamentales

### I. Simplicidad y estructura plana
El proyecto MUST mantener una estructura simple y plana, organizada por funcionalidad en `commands/`, `db/` y `utils/`. NO MUST usarse clean architecture ni capas excesivas. NO MUST agregarse librerías para tareas que se resuelven con pocas líneas de código, y NO MUST usarse ORMs: el acceso a datos se hace directamente con `better-sqlite3`.
Razón: un CLI de este tamaño se vuelve más difícil de mantener con abstracciones innecesarias.

### II. Estilo funcional
El código MUST preferir funciones sobre clases y funciones puras siempre que sea posible. Las variables y funciones usan `camelCase`; `PascalCase` se reserva exclusivamente para tipos e interfaces.
Razón: las funciones puras son más fáciles de probar y de razonar.

### III. Manejo de errores claro
La CLI NUNCA MUST mostrar stack traces al usuario. Los errores MUST presentarse con mensajes claros y accionables, y el proceso MUST terminar con código de salida 0 en caso de éxito y 1 en caso de error.
Razón: el usuario final necesita saber qué hacer, no ver detalles internos.

### IV. Pruebas de la lógica de negocio
Toda lógica de negocio MUST tener pruebas unitarias con Vitest. No se exige una cobertura mínima, pero una funcionalidad con lógica de negocio sin pruebas NO MUST fusionarse.
Razón: se prioriza la confianza en el comportamiento sobre una métrica de cobertura.

### V. Salida legible
Toda salida a la terminal MUST ser legible. Los listados MUST mostrarse en tablas (con `cli-table3` o similar). Los colores MUST usarse solo para estados y prioridades.
Razón: una salida consistente y sobria facilita el uso diario de la herramienta.

## Restricciones técnicas

- Lenguaje y runtime: TypeScript sobre Node.js (versión LTS), ejecutado directamente con `tsx` o similar.
- Base de datos: SQLite con `better-sqlite3`, almacenada en el archivo local `~/.task-cli/tasks.db`.
- Framework de CLI: Commander.js MUST usarse para el parseo de argumentos y comandos.
- Distribución: la CLI MUST poder instalarse globalmente con `npm install -g`.

## Flujo de desarrollo

- Los comentarios, la documentación, el `README.md` y los mensajes visibles para el usuario se escriben en español; los identificadores del código se mantienen en inglés.
- Los commits siguen Conventional Commits: tipo y alcance en inglés, descripción en español.
- Los nombres de las pruebas y los mensajes de las aserciones se escriben en español.
- Toda revisión de cambios MUST verificar el cumplimiento de esta constitución.

## Gobernanza

Esta constitución prevalece sobre cualquier otra práctica del proyecto. Las enmiendas MUST documentarse, justificarse y, si afectan código existente, incluir un plan de migración. El versionado sigue semver: MAJOR para eliminar o redefinir principios de forma incompatible, MINOR para agregar principios o ampliar guías de forma sustancial, PATCH para aclaraciones y correcciones de redacción. Toda complejidad adicional MUST justificarse frente al Principio I. Las reglas de origen están en `docs/reglas.md`.

**Versión**: 1.0.0 | **Ratificada**: 2026-10-14 | **Última enmienda**: 2026-10-14
