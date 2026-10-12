# Screen — Formulario de producto (crear y editar)

- **Route:** `/productos/nuevo` (crear) y `/productos/:id/editar` (editar)
- **Feature:** [Catálogo de productos](../features/productos.md)
- **Design reference:** sin maqueta; componentes estándar de Ionic.

---

## Purpose

Crear un producto nuevo o editar uno existente. Es una sola pantalla para las dos rutas: si la ruta trae `id` se edita (y los campos se precargan con `getProduct`); si no, se crea.

---

## UI regions

| Region | Component | Notes |
|--------|-----------|-------|
| Header | `IonHeader` + `IonToolbar` + `IonBackButton` + `IonTitle` | «Nuevo producto» o «Editar producto» según la ruta. |
| Body | `IonInput` para nombre, precio y stock | Campos controlados con `useState`; el mensaje de error de cada campo aparece junto a él. |
| Categoría | Un `IonButton` por elemento de `CATEGORIES` | Selección única; el elegido se muestra relleno y los demás en contorno; con su propio mensaje de error. |
| Errores del servidor | Bloque de texto en color de error | Muestra el mensaje y cada elemento de `details` cuando la API responde 400. |
| Footer / CTA | `IonButton` «Guardar» | Valida y guarda; se deshabilita mientras se guarda. |

---

## States

| State | Trigger | UI |
|-------|---------|-----|
| Loading | Edición: `getProduct(id)` en curso | Texto «Cargando producto…». |
| Loaded | Edición: producto cargado; creación: formulario vacío | Campos listos para escribir. |
| Empty | N/A | No aplica a un formulario. |
| Error | La carga falló (404, red) o `PUT`/`POST` falló | Carga: `EmptyState` con «Reintentar». Guardado: el mensaje y los `details` del servidor sobre el botón «Guardar». |
| Offline | La API no responde al cargar o al guardar | Error de red: se muestra el mensaje de `getErrorMessage`. |
| Validación | Se toca «Guardar» con datos inválidos | Cada campo inválido muestra su mensaje (de `validateProduct`) y no se llama a la API. |

---

## Actions

| User action | Result | Use case / event |
|-------------|--------|------------------|
| Escribir en un campo | Actualiza el valor y limpia el error de ese campo | `setName`, `setPrice`, `setStock` |
| Tocar una categoría | Selecciona esa categoría | `setCategory` |
| Tocar «Guardar» con datos válidos | Crea o actualiza el producto y vuelve a `/productos` | `createProduct` o `updateProduct` |
| Tocar «Guardar» con datos inválidos | Muestra los errores en línea; no llama a la API | `validateProduct` |
| El servidor rechaza (400) | Muestra su `error` y sus `details` | `ApiError.details` |

---

## Accessibility

- [x] Todos los elementos interactivos tienen una etiqueta visible (`IonInput` con `label`, botones con texto).
- [ ] Áreas táctiles ≥ 44×44 pt: por revisar con los tamaños por defecto de Ionic.
- [ ] El texto escala con el tamaño de fuente del sistema: por revisar.
- [ ] Contraste WCAG AA: por revisar con el tema por defecto.
