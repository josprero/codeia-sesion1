# API Endpoints - TMDB

## Overview
This document outlines the key TMDB API endpoints used in the application, including rate limits and JSON response examples.

## Rate Limits
- **Requests per 10 seconds**: 40
- **Requests per day**: No strict limit, but monitor for abuse
- **Authentication**: API key required for most endpoints

## Endpoints Table

| Endpoint | Method | Description | Parameters | Response |
|----------|--------|-------------|------------|----------|
| `/movie/{movie_id}` | GET | Get movie details | `movie_id` (integer) | Movie object |
| `/movie/popular` | GET | Get popular movies | `page` (optional, integer) | List of movies |
| `/search/movie` | GET | Search for movies | `query` (string), `page` (optional) | Search results |
| `/movie/{movie_id}/credits` | GET | Get movie credits | `movie_id` (integer) | Cast and crew |
| `/person/{person_id}` | GET | Get person details | `person_id` (integer) | Person object |
| `/genre/movie/list` | GET | Get movie genres | None | List of genres |

## JSON Examples

### Movie Details (`/movie/{movie_id}`)
```json
{
  "id": 550,
  "title": "Fight Club",
  "overview": "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
  "release_date": "1999-10-15",
  "genres": [
    {"id": 18, "name": "Drama"}
  ],
  "runtime": 139,
  "vote_average": 8.4
}
```

### Popular Movies (`/movie/popular`)
```json
{
  "page": 1,
  "results": [
    {
      "id": 550,
      "title": "Fight Club",
      "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      "release_date": "1999-10-15"
    }
  ],
  "total_pages": 500,
  "total_results": 10000
}
```

### Search Movies (`/search/movie`)
```json
{
  "page": 1,
  "results": [
    {
      "id": 550,
      "title": "Fight Club",
      "overview": "A ticking-time-bomb insomniac...",
      "release_date": "1999-10-15"
    }
  ],
  "total_pages": 1,
  "total_results": 1
}
```

## Reglas y prácticas para modelo Netflix (TMDB)

### 1) Reglas de consumo de datos (backend)
- .env debe contener:
  - `TMDB_API_KEY`
  - `TMDB_BASE_URL=https://api.themoviedb.org/3`
  - `TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/`
  - `TMDB_DEFAULT_LANGUAGE=es-ES`
- API proxy de backend: el cliente sólo pide `/api/`.
- En cada llamada TMDB añadir query param `api_key` y lenguaje: `language=${TMDB_DEFAULT_LANGUAGE}`.
- Retry en 429 usando `Retry-After`.
- Cache en memory/LRU 2 minutos para endpoints listados (popular/top_rated, genres, discover).

### 2) Endpoints de lógica de aplicación
- `/api/movies/popular?page=1`
- `/api/movies/top-rated?page=1`
- `/api/movies/upcoming?page=1`
- `/api/series/popular?page=1`
- `/api/discover/movie?genre=...&year=...&page=...`
- `/api/movies/:id`, `/api/movies/:id/credits`, `/api/movies/:id/videos`, `/api/movies/:id/recommendations`
- `/api/search?q=...&type=multi&page=...`
- `/api/genres/movie`, `/api/genres/tv`

### 3) Parámetros comunes en listados
- `page` (paginación)
- `sort_by` (`popularity.desc`, `vote_average.desc`, `release_date.desc`)
- `with_genres` (IDs separados por coma)
- `primary_release_year` / `first_air_date_year`
- `vote_average.gte` / `vote_count.gte`

### 4) UI: comportamiento a implementar
- Skeleton de carga en todos los listados y detail views.
- Dropdown modernos para filters (género, año, clasificación, idioma).
- Soporte theme switcher light/dark con clases `dark:` de Tailwind y tokens de shadcn.
- Carousels horizontales y grillas responsivas 1-2-4.

### 5) Esquema de datos para renderizado
- Película/serie: `id`, `title/name`, `overview`, `poster_path`, `backdrop_path`, `genres`, `vote_average`, `vote_count`, `release_date/first_air_date`, `original_language`, `runtime/episode_run_time`.
- Cast/crew: `cast[]` y `crew[]` desde `/credits`.
- Videos: `results[]` (YouTube trailer principal `type==Trailer` y `site==YouTube`).
- Recomendaciones: IDs + medias necesarias para cards.

### 6) Experiencia de usuario
- `home` se carga con 4 carruseles: popular, top-rated, upcoming, series popular.
- `card` con hover overlay + action “Ver detalle”.
- `search` con debounce 300ms y resultados en grid con paginación.
- `movie detail` con tabs (Info, Cast, Trailers, Similar).
- `404` / `error state` con mensaje claro + retry.

## Filtros de ejemplo en UI
- `GenreFilterDropdown`: `All` + géneros cargados.
- `YearRange`: range slider o menus 2020-2026.
- `RatingFilter`: de 1.0 a 10.0.
- `TypeSwitch`: Movies / TV.

## Paginación en UI
- Componente `Pagination` con `Previous`/`Next`, `page`, `total_pages`.
- Guardar `page` en `useSearchParams` para shareable URLs.
- Carga incremental (infinite scroll opcional) con placeholders.

---

## Reglas Additional: UI accesible
- `alt` en todas las imágenes.
- Contraste >4.5:1 en dark/light.
- Tab index y focus-visible en components.
- `aria-label` para botones y sliders.
