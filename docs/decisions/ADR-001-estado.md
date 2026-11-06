# ADR-001 — Manejo del estado de las pantallas

- **ID:** ADR-001
- **Date:** 2026-10-11
- **Status:** Accepted
- **Authors:** 11William11

---

## Context

La app tiene cuatro pantallas (lista, detalle, nuevo y editar) y cada una necesita guardar datos que cambian con el tiempo: los productos que llegan de la API, si la petición está cargando o falló, el texto de búsqueda, la categoría elegida y los valores del formulario. Hay que decidir **dónde vive ese estado** y con qué herramienta de React se maneja, para que todas las pantallas sigan el mismo patrón.

**Known constraints:**
- La app es pequeña: un solo recurso (`products`) y ningún dato compartido entre pantallas; cada pantalla vuelve a pedir lo que necesita a la API.
- El estado debe poder explicarse y probarse sin librerías extra (el parcial se evalúa con lo visto en clase).
- El framework de gobierno pide capas claras: `presentation` depende de `domain` y `data`, y `domain` no depende de nada.

---

## Decision

**We decided:** el estado de cada pantalla vive en la propia página con `useState`, y las cargas desde la API se disparan con `useEffect` (y con `useIonViewWillEnter` para recargar la lista al volver a ella).

**Justification:**
Es el patrón más simple que cubre todas las necesidades: no hay estado compartido entre pantallas, así que un store global no aporta nada. Mantener el estado dentro de cada página hace que cada pantalla se entienda leyendo un solo archivo. Las reglas que sí se pueden probar sin pantalla (validar, formatear, filtrar) van como funciones puras en `domain/`, de modo que el estado de la página solo guarda valores y estados de carga.

---

## Evaluated alternatives

| Alternative | Pros | Cons | Reason for discarding |
|-------------|------|------|-----------------------|
| `useState` + `useEffect` en cada página — chosen | Sin dependencias, fácil de leer y de explicar; encaja con el starter | La lógica de carga se repite en lista y detalle | — (chosen) |
| Hook propio por pantalla (`useProducts`, `useProduct`) | Saca la lógica de carga de la página y evita repetirla | Más archivos y una capa más que explicar para solo cuatro pantallas | El tamaño actual no lo justifica; se puede extraer después sin cambiar el comportamiento |
| Store global (Context, Redux, Zustand) | Un solo lugar para el estado compartido | No hay estado compartido; agrega una dependencia y mucho código de apoyo | Excesivo para el alcance |
| Librería de caché de peticiones (p. ej. TanStack Query) | Caché, reintentos y recarga automáticos | Dependencia nueva fuera de lo visto en clase | Fuera de alcance |

---

## Consequences

**Positive:**
- Cada pantalla es autocontenida y fácil de seguir.
- Cero dependencias nuevas.
- Las reglas de negocio quedan en funciones puras de `domain/`, fáciles de probar.

**Negative / Trade-offs:**
- El patrón `loading → ready | error` se escribe en cada página que carga datos.
- Si el estado tuviera que compartirse entre pantallas (por ejemplo, una caché de la lista), habría que subirlo a un hook compartido o a un store.

**Impact on the system:**
- Affected features/screens: lista, detalle y formulario de productos.
- Documents to update: [`features/productos.md`](../features/productos.md) (sección State).

---

## References

- Mobile Governance Framework: `01-architecture/layers-and-state.md`.
- Related to: [ADR-002 — Consumo de la API](./ADR-002-consumo-api.md).
