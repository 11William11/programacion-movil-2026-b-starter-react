# TODO · Parcial práctico C2

Trabaje las partes en orden. Cada punto indica qué se verifica. Busque en el código los comentarios `TODO(Parte N)`.

Convenciones (del framework, `coding-standards`): tipos y componentes en `PascalCase`, variables y funciones en `camelCase`, constantes en `UPPER_SNAKE_CASE`, booleanos con prefijo `is` / `has` / `should`, carpetas de funcionalidad en `kebab-case`.

## Parte 1 · Documentar antes de codificar (15 min · 1,0)

Copie cada plantilla de `docs/` con su nombre definitivo y llénela. **Haga un commit solo de documentos antes de escribir código.**

1. [ ] `docs/features/productos.md` a partir de `_template-feature.md`: propósito, tabla de pantallas con sus rutas, estado (patrón y transiciones cargando → cargado → error), casos límite (carga, vacío, error) y pruebas previstas.
2. [ ] Al menos **2 pantallas** documentadas en `docs/screens/` a partir de `_template-screen.md` (por ejemplo `lista-productos.md` y `formulario-producto.md`): regiones de la interfaz, estados y acciones.
3. [ ] `docs/decisions/ADR-001-estado.md` a partir de `_template-adr.md`: contexto, decisión (cómo se maneja el estado de la funcionalidad), alternativas y consecuencias.

## Parte 2 · Construir (40 min · 2,0)

Todo el trabajo va dentro de `src/features/products/`.

4. [ ] En `model/product.ts`, implementar `toProductView()` y `validateProduct()` según el contrato descrito en los comentarios de cada función.
5. [ ] **Lista** (`ui/ProductListPage.tsx`): mostrar los productos de `getProducts()` (son 8; se piden al menos 6 visibles) con los tres estados: **cargando**, **vacío** y **error** (con botón «Reintentar»). Cada producto se muestra con `ProductCard`.
6. [ ] **Componente reutilizable** (`ui/ProductCard.tsx`): tarjeta que recibe el producto por *props*, muestra nombre, categoría y precio, y avisa cuando quedan pocas unidades o está agotado.
7. [ ] **Detalle** (`ui/ProductDetailPage.tsx`): cargar el producto de la ruta con `getProduct(id)` y manejar carga y error (incluido «no encontrado»).
8. [ ] **Formulario** (`ui/ProductFormPage.tsx`): campos nombre, precio, categoría y stock; validar con `validateProduct()` (nombre obligatorio, precio mayor que 0), mostrar el mensaje junto a cada campo, guardar con `createProduct()` y volver a la lista.
9. [ ] Navegación completa: lista → detalle, lista → formulario y regreso desde ambas.

## Parte 3 · Calidad (15 min · 1,0)

10. [ ] Al menos **2 pruebas nuevas** en `src/features/products/__tests__/`: una de `validateProduct` y una de `toProductView`. Deben pasar con `npm test`.
11. [ ] Marcar el checklist de `docs/definition-of-done.md` en la descripción del PR (copie la lista y marque lo que cumple; lo que no aplique, indíquelo).
12. [ ] Ningún secreto en el repositorio: `.env` está ignorado y solo se versiona `.env.example`.

## Parte 4 · Git y entrega (10 min · 0,5)

13. [ ] Trabajar en una rama `feature/…` (no directamente en `main`).
14. [ ] Al menos **4 commits** con Conventional Commits (`type(scope): resumen`, en imperativo, 72 caracteres o menos).
15. [ ] **PR hacia el `main` de su propio fork**, con descripción. Pegar el enlace en Moodle antes de las 8:10 p. m.
16. [ ] README actualizado con cómo ejecutar su versión.

## Parte 5 · Inglés (10 min · 0,5)

17. [ ] En el README, una sección titulada **State management decision**, en inglés, de 3 a 5 frases: qué patrón de estado eligió (`useState`, un store, etc.), por qué, y qué cambiaría si la aplicación creciera.

## Antes de entregar

- [ ] `npm test` pasa.
- [ ] `npm run lint` y `npm run build` no muestran errores.
- [ ] El primer commit de código es posterior al commit de documentación.
- [ ] El enlace del PR está pegado en la actividad de Moodle.
