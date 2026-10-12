# Feature — Catálogo de productos

- **Owner:** 11William11
- **Status:** In progress
- **Related stories:** Parcial práctico C2 · Programación Móvil 2026-B (partes 1 a 7)

---

## Purpose

Permitir que una persona consulte el catálogo de productos de una tienda, lo filtre por nombre y categoría, vea el detalle de cada producto y lo cree, edite o elimine, todo contra una API propia en Express. Así se evita llevar el inventario «de memoria» y se ve de un vistazo qué productos están agotados o con pocas unidades.

---

## Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Lista de productos | `/productos` | Ver todos los productos, buscar por texto, filtrar por categoría e ir al detalle o al formulario de creación. |
| Detalle del producto | `/productos/:id` | Ver todos los campos de un producto, editarlo o eliminarlo (con confirmación en pantalla). |
| Nuevo producto | `/productos/nuevo` | Crear un producto con validación en línea. |
| Editar producto | `/productos/:id/editar` | Editar un producto existente; es la **misma pantalla** del formulario, con los campos precargados. |

> Cada pantalla se especifica en `docs/screens/`: [`lista-productos.md`](../screens/lista-productos.md), [`detalle-producto.md`](../screens/detalle-producto.md) y [`formulario-producto.md`](../screens/formulario-producto.md).

---

## State

- **Pattern:** estado local en cada página con `useState` y `useEffect` (ver [ADR-001](../decisions/ADR-001-estado.md)). No hay store global.
- **State object(s):**
  - Lista: `products`, `status` (`'loading' | 'ready' | 'error'`), `errorMessage`, `search` y `category`.
  - Detalle: `product`, `status`, `errorMessage`, `isConfirmingDelete` e `isDeleting`.
  - Formulario: un valor por campo (`name`, `price`, `category`, `stock`), `errors` por campo, `serverError` con `serverDetails`, e `isSaving`.
- **Key transitions:**
  - Lista: `loading → ready` (con datos) · `loading → error` (fallo de red o de la API) · `error → loading` al pulsar «Reintentar» · `ready → ready` al cambiar el texto o la categoría (se filtra en memoria con `filterProducts`).
  - Detalle: `loading → ready` · `loading → error` (incluye «no encontrado») · `ready → confirmar eliminación → eliminando → lista`.
  - Formulario: `editando → validando` (en línea con `validateProduct`) `→ guardando → lista`, o `guardando → editando con error del servidor`.

---

## Data

- **Use cases:** `getProducts`, `getProduct`, `createProduct`, `updateProduct` y `deleteProduct` (capa `data/`); `validateProduct`, `toProductView`, `filterProducts` y `formatCOP` (capa `domain/`).
- **Repositories:** no hay repositorio formal; el cliente HTTP `data/products-api.ts` cumple ese papel (ver [ADR-002](../decisions/ADR-002-consumo-api.md)).
- **Remote sources / endpoints:** `GET /api/products`, `GET /api/products/:id`, `POST /api/products`, `PUT /api/products/:id` y `DELETE /api/products/:id` — detalle en [`products-endpoints.md`](../api/products-endpoints.md).
- **Local persistence:** N/A. La API guarda los productos en memoria y se reinician al reiniciar el servidor; la app no guarda nada en el dispositivo.

---

## Edge cases & states

- [x] Loading — la lista y el detalle muestran «Cargando…» mientras llega la respuesta.
- [x] Empty — la API no devuelve productos: mensaje «No hay productos» con acción para crear uno.
- [x] Sin resultados — hay productos pero los filtros no encuentran ninguno: mensaje y acción para limpiar los filtros.
- [x] Error / retry — fallo de red o respuesta no exitosa: mensaje comprensible y botón «Reintentar».
- [x] Offline — no hay modo sin conexión; si la API no responde se trata como error de red (`ApiError` con `status` nulo) y se ofrece «Reintentar».
- [x] Producto inexistente — `GET /api/products/:id` responde 404; el detalle muestra «No encontramos ese producto.».
- [x] Datos inválidos — la validación en línea y, si el servidor rechaza (400), sus mensajes de `details`.
- [x] Stock agotado o bajo — etiqueta «Agotado» (0) o «Pocas unidades» (menos de 5) visible en la tarjeta y en el detalle.
- [ ] Permission denied — N/A: la app no pide permisos del dispositivo.

---

## Decisions

- [ADR-001 — Manejo del estado](../decisions/ADR-001-estado.md)
- [ADR-002 — Consumo de la API](../decisions/ADR-002-consumo-api.md)

---

## Tests

- Unit: `validateProduct` (campos obligatorios, límites y categoría), `toProductView` (formato de precio y etiquetas de stock) y `filterProducts` (texto sin distinguir mayúsculas y categoría exacta).
- API (con `startTestServer()`): `POST` inválido → 400 con `details`, `GET` de un id inexistente → 404, ruta desconocida → 404 con el formato de error y el flujo feliz de creación → 201.
- Widget/UI: no se escriben pruebas de pantallas; se verifican a mano contra la API en ejecución.
- Integration/E2E: N/A para este parcial.
