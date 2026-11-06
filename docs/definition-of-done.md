# Definition of Done (DoD) — Catálogo de productos

Adaptación del DoD del Mobile Governance Framework al parcial práctico C2. El trabajo está **terminado solo cuando se cumple todo lo que aplica**; lo que no aplica se declara con su motivo. Esta lista se copia y se marca en la descripción del Pull Request.

- [ ] **Criterios de aceptación cumplidos y verificados:** la API respeta el contrato (códigos 200, 201, 204, 400 y 404, filtros y formato `{ error, details[] }`) y la app hace el CRUD completo contra ella, con cuatro pantallas.
- [ ] **Documentación antes del código:** los siete documentos de `docs/` están llenos y el commit de documentación es anterior al primer commit de código (feature, pantallas, ADR-001, ADR-002, endpoints, entidad y este DoD).
- [ ] **Pruebas agregadas y en verde:** al menos 4 pruebas nuevas, con 2 o más unitarias (`validateProduct`, `toProductView`, `filterProducts`) y 2 o más de la API con `startTestServer()`; `npm test` pasa (ver [`04-quality/testing-strategy.md`](https://github.com/jesusarielgb-works/mobile-governance-framework/blob/main/04-quality/testing-strategy.md) del framework).
- [ ] **Sin avisos nuevos de calidad:** `npm run lint` (con `--max-warnings 0`) y `npm run build` (revisión de tipos y compilación) terminan sin errores ni avisos.
- [ ] **Estados de carga manejados:** la lista y el detalle tienen cargando, error con «Reintentar» y, en la lista, vacío y sin resultados; el offline es un error de red con el mismo «Reintentar».
- [ ] **Capas y nombres del framework:** `data/`, `domain/` y `presentation/` con las dependencias en un solo sentido, y nombres según `coding-standards` (PascalCase, camelCase, `UPPER_SNAKE_CASE`, booleanos con `is`/`has`/`should`).
- [ ] **Sin secretos:** `.env` está ignorado por Git y solo se versiona `.env.example`, sin claves ni contraseñas; no se sube `node_modules`.
- [ ] **Git y entrega:** rama `feature/…`, al menos 6 commits con Conventional Commits y Pull Request hacia `main` del propio fork, con descripción.
- [ ] **README al día:** explica cómo ejecutar (`npm run server` y `npm run dev`) e incluye las secciones en inglés *State management decision* y *API error handling*.
- [ ] **Ejercicio Kotlin:** `kotlin/Product.kt` compila y corre en el Kotlin Playground.

**No aplica a este parcial (con motivo):**

- *Corre en ambas plataformas objetivo:* N/A; el parcial se ejecuta como app web de Ionic en el navegador, no hay builds de Android ni de iOS.
- *Textos localizados:* N/A; la app existe solo en español y no hay internacionalización en el alcance.
- *Analítica y reporte de fallos:* N/A; no hay servicios de telemetría en el alcance.
- *Revisión y aprobación de otra persona antes del merge:* N/A; el trabajo es individual y el PR va al `main` del propio fork.

> Un trabajo que no cumple todo el DoD no está terminado: queda abierto. El trabajo parcial no se cierra «para terminarlo después».
