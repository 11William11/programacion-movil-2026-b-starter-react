# Catálogo de productos · Starter Ionic React

Parcial práctico del corte 2 · Programación Móvil · CORHUILA 2026-B (modalidad individual).

Este repositorio es el punto de partida. La funcionalidad «Catálogo de productos» está a medias: la estructura, el servicio de datos y las rutas ya existen; lo demás se construye durante el parcial siguiendo el [Mobile Governance Framework](https://github.com/jesusarielgb-works/mobile-governance-framework).

> El enunciado oficial es el PDF de la actividad en Moodle. Este README es un resumen; si algo difiere, manda el PDF.

## Cómo ejecutar

Requisito: Node.js 22.12 o superior.

```bash
npm install        # instala dependencias (una sola vez)
npm run dev        # arranca la app en http://localhost:5173
npm test           # corre las pruebas (Vitest)
npm run lint       # revisa el estilo del código
npm run build      # compila para producción
```

Rutas disponibles desde el inicio: `/productos` (lista), `/productos/:id` (detalle) y `/productos/nuevo` (formulario). Hoy son pantallas de relleno con un `TODO`.

Para ver los estados de la lista:

| Dirección | Qué simula |
|---|---|
| `/productos?error=1` | Falla de red (estado de error) |
| `/productos?empty=1` | Lista sin productos (estado vacío) |

También puede activar el error con `VITE_SIMULATE_ERROR=true` en un archivo `.env` local (copie `.env.example`). El archivo `.env` está ignorado por Git; nunca se versiona.

## Flujo de entrega

1. Haga un **fork** de este repositorio a su cuenta de GitHub y clónelo.
2. Cree una rama de funcionalidad: `git switch -c feature/productos`.
3. Trabaje la lista de [TODO.md](./TODO.md), en orden, haciendo commits pequeños con [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): resumen` (por ejemplo, `docs(productos): describe la funcionalidad` o `feat(productos): agrega la lista`).
4. Los documentos van **antes** que el código: el primer commit de código debe ser posterior al commit de documentación.
5. Abra un **Pull Request hacia el `main` de su propio fork** (no hacia el repositorio original), con una descripción de lo hecho y el checklist de `docs/definition-of-done.md` marcado.
6. Pegue el **enlace del PR** en la actividad de Moodle (texto en línea) antes de las 8:10 p. m.

## Qué se evalúa (5,0)

| Parte | Tiempo sugerido | Puntos |
|---|---|---|
| 1. Documentar antes de codificar | 15 min | 1,0 |
| 2. Construir | 40 min | 2,0 |
| 3. Calidad | 15 min | 1,0 |
| 4. Git y entrega | 10 min | 0,5 |
| 5. Inglés | 10 min | 0,5 |

El detalle de cada criterio está en [TODO.md](./TODO.md).

## Estructura

```text
docs/                       plantillas del framework (se copian y se llenan)
src/app/                    arranque, rutas y tema
src/data/products.json      8 productos de ejemplo
src/features/products/
  data/products-service.ts  servicio ya dado: latencia y error simulados
  model/product.ts          tipos + toProductView() y validateProduct() por implementar
  ui/                       páginas y componentes (stubs con TODO)
  __tests__/                prueba de ejemplo + espacio para las suyas
```

## Estado de la aplicación (sección a completar en la Parte 5)

Al terminar, agregue aquí abajo la sección **State management decision**, escrita en inglés (3 a 5 frases), tal como se indica en el punto 5 de [TODO.md](./TODO.md). También actualice este README con cualquier paso adicional necesario para ejecutar su versión.

---

Las plantillas de `docs/` provienen del Mobile Governance Framework (licencia MIT; ver `docs/LICENSE-mobile-governance-framework.txt`).
