# Entity — Product

> La plantilla describe una entidad de persistencia local. Aquí la entidad `Product` es el modelo que viaja entre la API y la app; lo que no aplica a un almacenamiento en memoria se indica como «N/A (almacenamiento en memoria)».

- **Store:** N/A (almacenamiento en memoria). La API copia `server/data/products.json` a un arreglo al arrancar y los cambios se pierden al reiniciar el servidor.
- **Table/collection:** N/A (almacenamiento en memoria). El recurso se expone como `/api/products`.
- **Schema version introduced:** N/A (almacenamiento en memoria).
- **Tipo en la app:** `Product` en `src/features/products/domain/product.ts`.

---

## Fields

| Column | Type | Null | Notes |
|--------|------|------|-------|
| `id` | number (entero) | No | Identificador. Lo asigna el servidor de forma incremental (el siguiente al mayor id existente, sin reutilizar ids eliminados). El cliente nunca lo envía en el cuerpo. |
| `name` | string | No | Obligatorio; texto no vacío (solo espacios cuenta como vacío) de máximo 60 caracteres (`NAME_MAX_LENGTH`). Se guarda sin espacios sobrantes al inicio ni al final. |
| `price` | number | No | Número finito mayor que 0, en pesos colombianos. Se muestra con `formatCOP` (p. ej. `$ 1.250.000`). |
| `category` | string | No | Obligatoria; una de `Bebidas`, `Snacks`, `Aseo` u `Hogar` (`CATEGORIES`, la misma lista en la API y en la app). |
| `stock` | number (entero) | No | Entero mayor o igual que 0. |

### Reglas derivadas (solo en la app, `toProductView`)

| Campo de vista | Regla |
|----------------|-------|
| `priceLabel` | `formatCOP(price)` |
| `stockLabel` | `Agotado` si `stock` es 0 · `Pocas unidades` si es menor que 5 (`LOW_STOCK_THRESHOLD`) · `Disponible` en otro caso |
| `isOutOfStock` | `stock === 0` |
| `isLowStock` | `stock` entre 1 y 4 |

---

## Indexes

N/A (almacenamiento en memoria). Las búsquedas recorren el arreglo completo; con ocho productos semilla no hace falta un índice.

---

## Relationships

N/A (almacenamiento en memoria). `Product` no se relaciona con otras entidades; la categoría es un texto de una lista fija, no una entidad aparte.

---

## Sync

- **Synced?** No. La app siempre consulta a la API; no hay copia local que sincronizar.
- **Conflict policy:** N/A (almacenamiento en memoria). Si dos personas editan el mismo producto, gana el último `PUT`.

---

## Migration notes

N/A (almacenamiento en memoria). No hay esquema que migrar: al reiniciar el servidor, los datos vuelven a ser los de `server/data/products.json`.
