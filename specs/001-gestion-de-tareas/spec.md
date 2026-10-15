# Especificación de la funcionalidad: Gestión de tareas personales desde la terminal

**Rama de la funcionalidad**: `001-gestion-de-tareas`

**Creada**: 2026-10-14

**Estado**: Borrador

**Entrada**: Descripción del usuario: "Construir un CLI llamado «task-cli» para gestión de tareas personales desde la terminal" (ver `docs/spec-input.md`)

## Clarificaciones

### Sesión 2026-10-14

- Q: ¿Cómo debe poder ver el usuario la descripción de una tarea, si la tabla del listado no la incluye? → A: Con un comando que muestre el detalle completo de una tarea por su ID.
- Q: ¿Qué debe pasar si el título de una tarea es muy largo para el ancho de la tabla del listado? → A: Se trunca con "…" en la tabla y se muestra completo en el detalle.

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Crear tareas (Prioridad: P1)

Como persona que organiza su trabajo desde la terminal, quiero crear tareas con un título y, opcionalmente, una prioridad y una descripción, para registrar rápidamente lo que debo hacer.

**Por qué esta prioridad**: Sin la capacidad de crear tareas no existe ningún dato con el que operar; es la base de todo el producto.

**Prueba independiente**: Se prueba creando una tarea con solo el título y verificando que se confirma su creación con un ID, estado "todo" y prioridad "medium".

**Escenarios de aceptación**:

1. **Dado** que no existen tareas, **cuando** creo una tarea solo con el título "Comprar leche", **entonces** se crea con ID 1, estado "todo" y prioridad "medium".
2. **Dado** que existe la tarea con ID 1, **cuando** creo otra tarea con título, prioridad "high" y descripción, **entonces** se crea con ID 2 y conserva la prioridad y la descripción indicadas.
3. **Dado** cualquier estado, **cuando** intento crear una tarea sin título, **entonces** se rechaza con un mensaje claro y no se crea nada.
4. **Dado** cualquier estado, **cuando** indico una prioridad distinta de high, medium o low, **entonces** se rechaza con un mensaje que lista los valores válidos.

---

### Historia de usuario 2 - Listar y filtrar tareas (Prioridad: P1)

Como persona con varias tareas, quiero ver mis tareas en una tabla y filtrarlas por estado o prioridad, para saber qué debo atender.

**Por qué esta prioridad**: Listar es lo que da valor a las tareas creadas; junto con la creación forma el producto mínimo viable.

**Prueba independiente**: Se prueba con varias tareas de distintos estados y prioridades, verificando la tabla, los filtros y el orden.

**Escenarios de aceptación**:

1. **Dado** que existen varias tareas, **cuando** las listo sin filtros, **entonces** veo una tabla con ID, título, estado, prioridad y fecha de creación, con las más recientes primero.
2. **Dado** tareas en distintos estados, **cuando** filtro por estado "in-progress", **entonces** solo veo las tareas en ese estado.
3. **Dado** tareas con distintas prioridades, **cuando** filtro por prioridad "high", **entonces** solo veo las tareas de esa prioridad.
4. **Dado** que combino filtro de estado y de prioridad, **cuando** listo, **entonces** veo solo las tareas que cumplen ambos.
5. **Dado** que no hay tareas que coincidan, **cuando** listo, **entonces** veo un mensaje indicando que no se encontraron tareas.
6. **Dado** una tarea con descripción, **cuando** pido ver su detalle por su ID, **entonces** veo todos sus campos, incluida la descripción completa.
7. **Dado** un ID inexistente, **cuando** pido ver su detalle, **entonces** recibo un mensaje claro de que la tarea no existe.

---

### Historia de usuario 3 - Cambiar el estado de una tarea (Prioridad: P2)

Como persona que avanza en sus tareas, quiero cambiar el estado de una tarea siguiendo un flujo válido, para reflejar su progreso real.

**Por qué esta prioridad**: Permite seguir el progreso, pero requiere que ya se puedan crear y ver tareas.

**Prueba independiente**: Se prueba cambiando el estado de una tarea por cada transición válida y comprobando que las no válidas se rechazan.

**Escenarios de aceptación**:

1. **Dado** una tarea en "todo", **cuando** la paso a "in-progress", **entonces** el cambio se aplica.
2. **Dado** una tarea en "in-progress", **cuando** la paso a "done" o la devuelvo a "todo", **entonces** el cambio se aplica.
3. **Dado** una tarea en "done", **cuando** la paso a "todo", **entonces** se reabre.
4. **Dado** una tarea en "todo", **cuando** intento pasarla directamente a "done", **entonces** se rechaza con un mensaje que explica que debe pasar antes por "in-progress", y el estado no cambia.
5. **Dado** un ID inexistente, **cuando** intento cambiar el estado, **entonces** recibo un mensaje claro de que la tarea no existe.

---

### Historia de usuario 4 - Actualizar una tarea (Prioridad: P3)

Como persona que corrige o precisa sus tareas, quiero modificar el título, la descripción o la prioridad de una tarea existente, para mantener la información al día.

**Por qué esta prioridad**: Es una comodidad; el producto es útil sin ella.

**Prueba independiente**: Se prueba modificando cada campo de una tarea y verificando el resultado en el listado.

**Escenarios de aceptación**:

1. **Dado** una tarea existente, **cuando** cambio su título, **entonces** el nuevo título se refleja y los demás campos no cambian.
2. **Dado** una tarea existente, **cuando** cambio su descripción y su prioridad a la vez, **entonces** ambos cambios se aplican.
3. **Dado** una tarea existente, **cuando** intento dejar el título vacío, **entonces** se rechaza y la tarea no cambia.
4. **Dado** un ID inexistente, **cuando** intento actualizar, **entonces** recibo un mensaje claro de que la tarea no existe.

---

### Historia de usuario 5 - Eliminar una tarea (Prioridad: P3)

Como persona que descarta tareas, quiero eliminar una tarea con confirmación previa, para evitar borrados accidentales.

**Por qué esta prioridad**: Es una función de mantenimiento que no bloquea el uso principal.

**Prueba independiente**: Se prueba eliminando una tarea con confirmación, cancelando, y usando `--force`.

**Escenarios de aceptación**:

1. **Dado** una tarea existente, **cuando** pido eliminarla y confirmo, **entonces** la tarea desaparece del listado.
2. **Dado** una tarea existente, **cuando** pido eliminarla y rechazo la confirmación, **entonces** la tarea se conserva.
3. **Dado** una tarea existente, **cuando** la elimino con `--force`, **entonces** se elimina sin pedir confirmación.
4. **Dado** un ID inexistente, **cuando** intento eliminar, **entonces** recibo un mensaje claro de que la tarea no existe.

---

### Casos límite

- ¿Qué ocurre si el ID indicado no es un número válido (texto, negativo, cero)? Se rechaza con un mensaje claro.
- ¿Qué ocurre si el título es más largo que el ancho disponible de la tabla? Se trunca con "…" en el listado y se muestra completo en el detalle.
- ¿Qué ocurre si el título está formado solo por espacios en blanco? Se trata como vacío y se rechaza.
- ¿Qué ocurre al actualizar una tarea sin indicar ningún campo a modificar? Se informa de que no hay cambios que aplicar.
- ¿Qué ocurre si se usa un valor de filtro inválido (estado o prioridad)? Se rechaza listando los valores válidos.
- ¿Qué ocurre si se cambia una tarea al estado que ya tiene? Se informa de que la tarea ya está en ese estado, sin error destructivo.
- ¿Se reutilizan los IDs de tareas eliminadas? No; los IDs nuevos nunca repiten uno ya asignado.
- ¿Qué ocurre si la confirmación de eliminación se pide sin terminal interactiva? Se trata como no confirmada, salvo que se use `--force`.

## Requisitos *(obligatorio)*

### Requisitos funcionales

- **FR-001**: El sistema DEBE permitir crear una tarea con un título obligatorio, y rechazar títulos vacíos o formados solo por espacios.
- **FR-002**: El sistema DEBE permitir indicar opcionalmente una prioridad (high, medium, low) y una descripción al crear una tarea, con prioridad "medium" por defecto.
- **FR-003**: El sistema DEBE asignar a cada tarea un ID numérico autoincremental que no se reutilice tras eliminar tareas.
- **FR-004**: El sistema DEBE crear cada tarea con estado "todo" y registrar su fecha de creación.
- **FR-005**: El sistema DEBE listar las tareas en formato de tabla con ID, título, estado, prioridad y fecha de creación.
- **FR-006**: El sistema DEBE ordenar el listado por fecha de creación, de más reciente a más antigua.
- **FR-007**: El sistema DEBE permitir filtrar el listado por estado (`--status todo|in-progress|done`) y por prioridad (`--priority high|medium|low`), y combinar ambos filtros.
- **FR-008**: El sistema DEBE permitir cambiar el estado de una tarea por su ID.
- **FR-009**: El sistema DEBE aceptar únicamente las transiciones todo → in-progress, in-progress → done, in-progress → todo y done → todo, y rechazar cualquier otra, incluida todo → done, con un mensaje que explique el motivo.
- **FR-010**: El sistema DEBE permitir modificar el título, la descripción o la prioridad de una tarea existente por su ID, sin alterar los campos no indicados.
- **FR-011**: El sistema DEBE pedir confirmación antes de eliminar una tarea y permitir omitirla con `--force`.
- **FR-012**: El sistema DEBE mostrar un mensaje claro cuando el ID no exista o los valores indicados no sean válidos, indicando los valores permitidos cuando corresponda.
- **FR-013**: El sistema DEBE conservar las tareas entre ejecuciones del programa.
- **FR-014**: El sistema DEBE ofrecer un comando que muestre el detalle completo de una tarea por su ID (ID, título, descripción, estado, prioridad y fecha de creación).
- **FR-015**: El sistema DEBE truncar con "…" los títulos que excedan el ancho disponible de la tabla del listado, sin romper su formato, y mostrarlos completos en el detalle.

### Entidades clave

- **Tarea**: Unidad de trabajo personal. Atributos: ID numérico único, título, descripción (opcional), estado (todo, in-progress, done), prioridad (high, medium, low) y fecha de creación.

## Criterios de éxito *(obligatorio)*

### Resultados medibles

- **SC-001**: Una persona puede crear una tarea y verla en el listado en menos de 30 segundos desde su primer uso.
- **SC-002**: El 100 % de las transiciones de estado no válidas se rechazan sin modificar la tarea, y el 100 % de las válidas se aplican.
- **SC-003**: El listado de hasta 1 000 tareas se muestra en menos de 1 segundo.
- **SC-004**: En el 100 % de los casos de error (ID inexistente, valor inválido, título vacío) el usuario recibe un mensaje comprensible que indica cómo corregirlo.
- **SC-005**: Ninguna tarea se elimina sin confirmación explícita, salvo que se use `--force`.

## Supuestos

- La herramienta es de uso personal, para una sola persona en un solo equipo.
- Las tareas se conservan localmente entre ejecuciones.
- Fuera de alcance en esta versión: usuarios y autenticación, sincronización con servicios externos, fechas de vencimiento, subtareas y dependencias, tags y categorías, interfaz web y API REST.
- Los valores de estado y prioridad (`todo`, `in-progress`, `done`, `high`, `medium`, `low`) se usan tal cual en los comandos.
- Los mensajes y la ayuda de la herramienta se muestran en español.
- La fecha de creación se muestra en la zona horaria local del usuario.
