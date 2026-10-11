# Endpoint Integration — API de productos (`/api/products`)

> Documenta cómo la app consume los cinco endpoints de la API Express (`server/app.js`). La entidad que viaja en ellos está en [`product-entity.md`](./product-entity.md) y la decisión de cómo se consume en [ADR-002](../decisions/ADR-002-consumo-api.md).

- **Feature:** [Catálogo de productos](../features/productos.md)
- **Base URL:** `API_URL` (`VITE_API_URL`, por defecto `http://localhost:3000`)
- **Auth required:** No
- **Formato de error (todos los endpoints):** `{ "error": "mensaje", "details": ["..."] }`, con un mensaje en `details` por cada problema.

---

## Resumen

| Método y ruta | Éxito | Errores | Función de la app |
|---------------|-------|---------|-------------------|
| `GET /api/products` | 200 + arreglo | — | `getProducts` |
| `GET /api/products/:id` | 200 + producto | 400 · 404 | `getProduct` |
| `POST /api/products` | 201 + producto creado | 400 | `createProduct` |
| `PUT /api/products/:id` | 200 + producto actualizado | 400 · 404 | `updateProduct` |
| `DELETE /api/products/:id` | 204 sin cuerpo | 400 · 404 | `deleteProduct` |

Además, una ruta desconocida responde `404` con el mismo formato de error, y un fallo inesperado del servidor responde `500` (`Error interno del servidor`); ambos los dan los manejadores que ya vienen en `createApp()`.

---

## 1. Listar productos — `GET /api/products`

### Request

| Param | In | Type | Required | Notes |
|-------|----|------|----------|-------|
| `search` | query | string | No | Devuelve los productos cuyo **nombre contiene** el texto, sin distinguir mayúsculas. |
| `category` | query | string | No | Devuelve los productos de esa categoría, **coincidencia exacta**. |

Los dos filtros pueden combinarse. Sin parámetros se devuelve el catálogo completo.

### Response

**Success (200):**
```json
[
  { "id": 1, "name": "Agua mineral 600 ml", "price": 1800, "category": "Bebidas", "stock": 120 }
]
```

**DTO → domain mapping:**
| DTO field | Domain field | Transform |
|-----------|--------------|-----------|
| `id`, `name`, `price`, `category`, `stock` | `Product` | Ninguna (mismos nombres y tipos) |
| `price`, `stock` | `ProductView.priceLabel`, `stockLabel` | `toProductView` aplica `formatCOP` y la etiqueta de stock al mostrarlos |

### Errors

| Status | Meaning | App behavior |
|--------|---------|--------------|
| — | La API no define errores propios para la lista | Si la API no responde (error de red) o devuelve 5xx, la lista muestra el estado de error con «Reintentar» |

---

## 2. Consultar un producto — `GET /api/products/:id`

### Request

| Param | In | Type | Required | Notes |
|-------|----|------|----------|-------|
| `id` | path | entero | Yes | Solo dígitos; `parseId` devuelve `null` si no lo es. |

### Response

**Success (200):** el producto, con la misma forma de arriba.

### Errors

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 400 | `id` no numérico (`abc`, `1.5`, `-2`) → `{ "error": "El id debe ser numérico", "details": ["id recibido: abc"] }` | El detalle muestra el mensaje de error con «Reintentar» |
| 404 | No existe un producto con ese id → `{ "error": "Producto no encontrado", "details": ["No existe un producto con id 99"] }` | El detalle muestra «No encontramos ese producto.» |

---

## 3. Crear un producto — `POST /api/products`

### Request

**Body (JSON, sin `id`; el servidor lo asigna):**
```json
{ "name": "Café molido 250 g", "price": 9800, "category": "Hogar", "stock": 12 }
```

| Field | Type | Required | Validación |
|-------|------|----------|------------|
| `name` | string | Yes | Texto no vacío (los espacios solos no cuentan), máximo 60 caracteres; se guarda sin espacios sobrantes en los extremos. |
| `price` | number | Yes | Número finito mayor que 0. |
| `category` | string | Yes | Una de `Bebidas`, `Snacks`, `Aseo` u `Hogar`. |
| `stock` | integer | Yes | Entero mayor o igual que 0. |

### Response

**Success (201):** el producto creado, con el `id` incremental asignado (el siguiente al mayor id existente; los ids de productos eliminados no se reutilizan).

### Errors

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 400 | El cuerpo no valida → `{ "error": "Datos inválidos", "details": ["name es obligatorio", "price debe ser un número mayor que 0"] }`, un mensaje por cada problema | El formulario muestra el `error` y cada elemento de `details` |
| 400 | El cuerpo no es un JSON válido → `{ "error": "El cuerpo no es un JSON válido", "details": [] }` | Igual que el anterior |

---

## 4. Actualizar un producto — `PUT /api/products/:id`

### Request

- `id` en la ruta, igual que en el detalle.
- **Body (JSON):** los mismos cuatro campos y las mismas validaciones que en `POST`. El `id` del cuerpo, si llega, se ignora: siempre manda el de la ruta.

### Response

**Success (200):** el producto con los datos nuevos.

### Errors

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 400 | `id` no numérico, o cuerpo que no valida (mismos mensajes que arriba) | El formulario muestra el `error` y los `details` |
| 404 | No existe un producto con ese id | El formulario de edición muestra «No encontramos ese producto.» |

---

## 5. Eliminar un producto — `DELETE /api/products/:id`

### Request

- `id` en la ruta; sin cuerpo.

### Response

**Success (204):** sin cuerpo (`res.status(204).end()`). El cliente `request<T>` devuelve `undefined` y la app vuelve a la lista.

### Errors

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 400 | `id` no numérico | El detalle muestra el mensaje de error |
| 404 | No existe un producto con ese id | El detalle muestra «No encontramos ese producto.» |

---

## Caching / offline

- **Strategy:** online-only. La app no guarda respuestas; la lista se vuelve a pedir cada vez que se entra a la pantalla.
- **Cached entity:** ninguna (ver [`product-entity.md`](./product-entity.md)).
- **TTL / invalidation:** N/A. Tras crear, editar o eliminar, la lista se recarga al volver a ella.
