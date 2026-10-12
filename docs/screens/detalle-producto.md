# Screen — Detalle del producto

- **Route:** `/productos/:id`
- **Feature:** [Catálogo de productos](../features/productos.md)
- **Design reference:** sin maqueta; componentes estándar de Ionic.

---

## Purpose

Ver todos los campos de un producto (nombre, categoría, precio, stock y etiqueta de stock) y decidir si se edita o se elimina.

---

## UI regions

| Region | Component | Notes |
|--------|-----------|-------|
| Header | `IonHeader` + `IonToolbar` + `IonBackButton` + `IonTitle` | Título «Detalle del producto»; el botón de atrás vuelve a `/productos`. |
| Body | `IonList` / `IonItem` / `IonLabel` | Un renglón por campo: nombre, categoría, precio (`formatCOP`), stock y etiqueta de stock (`toProductView`). |
| Footer / CTA | `IonButton` «Editar» y `IonButton` «Eliminar» | «Editar» navega a `/productos/:id/editar`; «Eliminar» abre la confirmación. |
| Confirmación | Bloque en pantalla con «¿Eliminar este producto?» | Botones «Confirmar» y «Cancelar»; se muestra al tocar «Eliminar», sin diálogos del navegador. |

---

## States

| State | Trigger | UI |
|-------|---------|-----|
| Loading | `getProduct(id)` en curso | Texto «Cargando producto…». |
| Loaded | La API devolvió el producto | Los campos, y los botones «Editar» y «Eliminar». |
| Empty | N/A | No aplica: un solo producto siempre trae datos o un error. |
| Error | `getProduct` falló (red, 400 o 404) | `EmptyState` con el mensaje de `getErrorMessage` («No encontramos ese producto.» si es 404) y «Reintentar». |
| Offline | La API no responde | Error de red: mismo estado de error, con «Reintentar». |
| Eliminando | Se confirmó la eliminación | Los botones se deshabilitan hasta que responde la API. |

---

## Actions

| User action | Result | Use case / event |
|-------------|--------|------------------|
| Tocar «Editar» | Navega a `/productos/:id/editar` | `routerLink` |
| Tocar «Eliminar» | Muestra «¿Eliminar este producto?» con «Confirmar» y «Cancelar» | `isConfirmingDelete` |
| Tocar «Cancelar» | Oculta la confirmación | `isConfirmingDelete` |
| Tocar «Confirmar» | Elimina el producto y vuelve a `/productos`; si falla, muestra el error | `deleteProduct(id)` |
| Tocar «Reintentar» | Vuelve a pedir el producto | `getProduct(id)` |

---

## Accessibility

- [x] Todos los elementos interactivos tienen una etiqueta visible (botones con texto).
- [ ] Áreas táctiles ≥ 44×44 pt: por revisar con los tamaños por defecto de Ionic.
- [ ] El texto escala con el tamaño de fuente del sistema: por revisar.
- [ ] Contraste WCAG AA: por revisar con el tema por defecto.
