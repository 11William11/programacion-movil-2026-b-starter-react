# ADR-002 — Consumo de la API de productos

- **ID:** ADR-002
- **Date:** 2026-10-11
- **Status:** Accepted
- **Authors:** 11William11

---

## Context

La app necesita hablar con la API Express (`/api/products`) para listar, consultar, crear, editar y eliminar productos. Hay que decidir **cómo se hacen las peticiones**, **dónde se configura la dirección de la API** y **dónde se traducen los errores** a algo que la persona usuaria entienda. Si cada pantalla hiciera su propio `fetch`, el manejo de errores quedaría repetido e inconsistente.

**Known constraints:**
- La dirección de la API cambia entre equipos y ambientes (`http://localhost:3000` en desarrollo) y no debe quedar escrita en el código de las pantallas.
- Hay dos tipos de fallo muy distintos: la API no responde (error de red) y la API responde con un código de error (400, 404, 500).
- El framework pide mapear los errores de bajo nivel (red, parseo) a errores del dominio antes de que lleguen a la interfaz.

---

## Decision

**We decided:** usar `fetch` desde un único cliente en la capa `data/` (`products-api.ts`), con la dirección base en `API_URL` (`data/config.ts`, leída de `VITE_API_URL` con `http://localhost:3000` por defecto) y una clase `ApiError` (`data/api-error.ts`) como único tipo de error que sale de esa capa.

**Justification:**
La función interna `request<T>` concentra el trabajo repetido: si `fetch` lanza una excepción, la API no respondió y se lanza un `ApiError` con `status` en `null` (`isNetworkError`); si la respuesta no es exitosa (`!response.ok`), se lee el cuerpo `{ error, details }` y se lanza un `ApiError` con el código y los mensajes del servidor; el 204 del `DELETE` no tiene cuerpo y devuelve `undefined`. Las funciones `getProducts`, `getProduct`, `createProduct`, `updateProduct` y `deleteProduct` solo arman la ruta y el cuerpo. Las pantallas capturan el `ApiError` y usan `getErrorMessage` para mostrar el texto; no conocen `fetch` ni códigos HTTP.

---

## Evaluated alternatives

| Alternative | Pros | Cons | Reason for discarding |
|-------------|------|------|-----------------------|
| `fetch` en un cliente de la capa `data/` + `ApiError` — chosen | Sin dependencias; un solo lugar para errores; las pantallas quedan simples | Hay que escribir el manejo de errores a mano | — (chosen) |
| `fetch` directo dentro de cada pantalla | Menos archivos | Código repetido; cada pantalla trataría los errores a su manera; mezcla UI con HTTP | Rompe la separación de capas |
| `axios` | Interceptores y errores ya tipados | Dependencia extra para cinco llamadas simples | No aporta lo suficiente |
| TanStack Query | Caché, reintentos y recarga | Dependencia nueva y fuera de lo visto en clase | Fuera de alcance |

---

## Consequences

**Positive:**
- Las pantallas distinguen «no hay conexión» de «el servidor respondió con un error» mirando `ApiError.isNetworkError` y `status`.
- Los mensajes del servidor (`details`) llegan intactos al formulario.
- Cambiar la dirección de la API es cambiar una variable de entorno (`.env`, que no se versiona; se versiona `.env.example`).

**Negative / Trade-offs:**
- No hay caché ni reintentos automáticos: «Reintentar» es una acción manual de la persona usuaria.
- Un error de red se muestra con el mismo mensaje en cualquier pantalla; no se distingue si fue el servidor apagado o la conexión del dispositivo.

**Impact on the system:**
- Affected features/screens: lista, detalle y formulario de productos.
- Documents to update: [`api/products-endpoints.md`](../api/products-endpoints.md).

---

## References

- Mobile Governance Framework: `03-api-and-data/api-networking.md` y `02-code-and-ui/coding-standards.md` (sección Error handling).
- Related to: [ADR-001 — Manejo del estado](./ADR-001-estado.md).
