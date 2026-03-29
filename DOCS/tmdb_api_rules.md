# TMDB API Rules y Planificación Netflix-like

Este documento recoge las reglas y la planificación para consumir TMDB en un producto tipo Netflix usando Node, dotenv, React 18 (legacy), Tailwind y shadcn.

## 1) Configuración básica
- .env en backend:
  - TMDB_API_KEY
  - TMDB_BASE_URL=https://api.themoviedb.org/3
  - TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/
  - TMDB_DEFAULT_LANGUAGE=es-ES
- .env.local en cliente:
  - VITE_API_URL=http://localhost:4000/api
- Proteger .env en .gitignore.

## 2) Endpoints internos (backend proxy)
- /api/movies/popular?page=
- /api/movies/top-rated?page=
- /api/movies/upcoming?page=
- /api/series/popular?page=
- /api/discover/movie?with_genres=&sort_by=&page=&year=
- /api/search?q=&type=multi&page=
- /api/movies/:id
- /api/movies/:id/credits
- /api/movies/:id/videos
- /api/movies/:id/recommendations
- /api/genres/movie
- /api/genres/tv

## 3) Regla de datos y normalización
- Convertir paths a URL completo con TMDB_IMAGE_BASE_URL + size (w500/original).
- Estandarizar objeto: {id, title, subtitle, overview, image, rating, releaseDate, genres}.
- Cache en memory/LRU 120s para listados.

## 4) Paginación y filtros en listados
- Filtros: genre, year, rating, sort_by, type.
- Query params obligatorios/optativos: page, with_genres, primary_release_year, vote_average.gte, vote_count.gte.
- API responde con page, total_pages, total_results, results.

## 5) UI a implementar (shadcn + Tailwind)
- Home con carruseles de cards.
- Skeletons: filas y cards.
- Dropdown modernos: filtros en panel lateral o top bar.
- Botones de orden, paginación y modo claro/oscuro.
- Movie detail con tabs (Info/Cast/Trailer/Similar).

## 6) Accesibilidad y temas
- Light/dark themes con variables CSS y Tailwind `dark:`.
- Contraste >=4.5:1.
- `aria-label`, roles, focus ring.
- WAI-ARIA para dropdown y modales.

## 7) Metas y release
- MVP 0.2.0:
  - API node proxy + env
  - Home movie/TV cards
  - Detail + cast
  - Search + paginación
  - Tema light/dark
- 0.3.0:
  - Watchlist / rating usuario
  - Autenticación opcional TMDB account
  - Infinite scroll
  - testes E2E
