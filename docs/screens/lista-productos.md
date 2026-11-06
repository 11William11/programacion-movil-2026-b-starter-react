# Screen — Lista de productos

- **Route:** `/productos`
- **Feature:** [Catálogo de productos](../features/productos.md)
- **Design reference:** sin maqueta; se usan los componentes estándar de Ionic (`IonHeader`, `IonList`, `IonButton`).

---

## Purpose

Ver todos los productos del catálogo, encontrar uno por nombre o por categoría, abrir su detalle y crear uno nuevo.

---

## UI regions

| Region | Component | Notes |
|--------|-----------|-------|
| Header | `IonHeader` + `IonToolbar` + `IonTitle` | Título «Productos». |
| Búsqueda | `IonInput` | Filtra por texto: el nombre contiene lo escrito, sin distinguir mayúsculas. |
| Filtro de categoría | Cinco `IonButton` | «Todas», «Bebidas», «Snacks», «Aseo» y «Hogar»; el activo se muestra relleno y los demás en contorno. |
| Body | `IonList` con un `ProductCard` por producto | Nombre, categoría, precio con `formatCOP` y etiqueta de stock; los estados vacío, sin resultados y error usan `EmptyState`. |
| Footer / CTA | `IonButton` «Nuevo producto» | Navega a `/productos/nuevo`. |

---

## States

| State | Trigger | UI |
|-------|---------|-----|
| Loading | La petición `getProducts()` está en curso | Texto «Cargando productos…». |
| Loaded | La API devolvió al menos un producto y los filtros dejan resultados | Lista de `ProductCard`. |
| Empty | La API devolvió un arreglo vacío | `EmptyState` «No hay productos» con la acción de crear uno. |
| Sin resultados | Hay productos, pero el texto o la categoría no encuentran ninguno | `EmptyState` «Sin resultados» con la acción de limpiar los filtros. |
| Error | La petición falló (red o respuesta no exitosa) | `EmptyState` con el mensaje de `getErrorMessage` y el botón «Reintentar». |
| Offline | La API no responde | Es un error de red: mismo estado de error, con «Reintentar». |

---

## Actions

| User action | Result | Use case / event |
|-------------|--------|------------------|
| Escribir en el buscador | Se filtra la lista en memoria | `filterProducts` |
| Tocar un botón de categoría | Se filtra por esa categoría («Todas» quita el filtro) | `filterProducts` |
| Tocar un producto | Navega a `/productos/:id` | `history.push` |
| Tocar «Nuevo producto» | Navega a `/productos/nuevo` | `history.push` |
| Tocar «Reintentar» | Vuelve a pedir la lista | `getProducts` |
| Volver desde otra pantalla | Recarga la lista para ver los cambios | `useIonViewWillEnter` |

---

## Accessibility

- [x] Todos los elementos interactivos tienen una etiqueta visible (botones con texto, `IonInput` con `label`).
- [ ] Áreas táctiles ≥ 44×44 pt: por revisar con los tamaños por defecto de Ionic.
- [ ] El texto escala con el tamaño de fuente del sistema: por revisar.
- [ ] Contraste WCAG AA: por revisar con el tema por defecto.
