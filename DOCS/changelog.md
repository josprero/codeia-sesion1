# CHANGELOG inicial

## [Unreleased]

- docs: Crear documentación inicial de TMDB, arquitectura y políticas de versión.
- feat: Agregar planificación de integración frontend + reglas de transformación en `DOCS/api_endpoints.md`.
- chore: Añadir checklist de filtros, paginación, skeleton y temas claro/oscuro color Netflix.

## [1.2.0] - 2026-03-29
- feat: Rediseño completo de UI Home — HeroSlider full-viewport con backdrop 16:9, autoplay y progress bar.
- feat: Sliders de categorías por género (Acción, Comedia, Drama, Terror, Sci-Fi, Thriller, Romance, Animación, Crimen).
- feat: Sliders por ranking (Mejor Valoradas) y por año (2025, 2024).
- feat: Componente `MovieRow` con scroll horizontal, flechas hover y fade lateral.
- feat: Componente `MovieRowCard` con imagen 16:9, título y overlay de hover.
- feat: Búsqueda moderna en tiempo real con input pill glassmorphism, icono SVG y botón de limpiar.
- feat: Página de búsqueda independiente con header editorial, grid 5 columnas y estado vacío.
- feat: Navbar condicional — gradiente sobre hero, sólido con blur al buscar.
- feat: Rediseño página de película — banner full-width, poster solapado, nav sticky de secciones.
- feat: Sección Reparto con fotos cuadradas en scroll horizontal.
- feat: Sección Trailer — thumbnail YouTube con modal fullscreen autoplay.
- feat: Sección Dónde Ver con logos de plataformas agrupados por tipo (streaming/alquiler/compra).
- feat: Sección Reseñas con cards de autor, rating y fecha.
- feat: Sección Similares en slider horizontal.
- feat: Nuevos endpoints TMDB — fetchNowPlaying, fetchTopRated, fetchByGenre, fetchByYear, fetchMovieCredits, fetchMovieVideos, fetchMovieWatchProviders, fetchMovieReviews, fetchMovieRecommendations.
- chore: Añadir campo `backdrop` (w1280), `runtime` al tipo Movie y normalización.
- chore: Renombrar app a Verflix.
- chore: Corregir tsconfig moduleResolution a Bundler y añadir vite-env.d.ts.

### Roadmap y deadline
- Fecha actual: 2026-03-29
- Deadline MVP v1.1.0: 2026-04-05
- Deadline release candidate v1.1.0-rc.1: 2026-04-03
- Deadline patch v1.1.1 (correcciones UX): 2026-04-10

## [1.1.0] - 2026-03-29
- feat: Implementar scaffold de frontend React + Vite + Tailwind + shadcn.
- feat: Añadir cliente TMDB (`src/lib/tmdb.ts`) y normalización (`src/lib/transform.ts`).
- feat: Componentes de UI (`MovieCard`, `MovieGrid`, `SearchInput`).
- chore: Añadir `src/App.tsx` con trending/popular/búsqueda y estado de error/loading.
- docs: Avanzar versionado y plan de despliegue.

## [1.0.0] - 2026-03-29
- feat: Añadir soporte inicial de endpoints TMDB en `/DOCS/api_endpoints.md`.
- docs: Definir modelo de datos normalizado en `/DOCS/data_model.md`.
- docs: Documentar arquitectura legacy en `/DOCS/arquitectura.md`.
- docs: Establecer plan de commits y tags en `/DOCS/plan_commits.md`.
- docs: Establecer política de versionado y release notes en `/DOCS/versionado_release.md`.
- docs: Establecer política de dependencias en `/DOCS/dependencias.md`.
