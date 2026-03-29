# TMDB API Endpoints

## Tabla de endpoints
| Recurso | Método | Endpoint | Descripción | Límites | Ejemplo JSON salida |
|---|---|---|---|---|---|
| Películas populares | GET | `/movie/popular` | Lista de películas populares | 40 req/min (TMDB) | `{ "results": [ ... ] }` |
| Película por id | GET | `/movie/{movie_id}` | Detalle de película | 40 req/min | `{ "id": 550, "title": "Fight Club" }` |
| Búsqueda de películas | GET | `/search/movie` | Buscar películas por texto | 40 req/min | `{ "results": [ ... ] }` |
| Géneros | GET | `/genre/movie/list` | Lista de géneros | 40 req/min | `{ "genres": [ {"id":28, "name":"Action"} ] }` |
| Imágenes | GET | `/configuration` | Config para URLs de imágenes | 40 req/min | `{ "images": { "base_url": "https://image.tmdb.org/t/p/" }}` |

## Consideraciones de límites
- TMDB free tier: 40 peticiones por segundo según documentación; se recomienda throttle en 30/sec.
- Usar caché (local / Redis) para recursos no volátiles (géneros, configuración, detalles de película en una sesión).
- Garantizar reintentos exponenciales ante 429.

## Ejemplos (JavaScript)
```js
const fetchTmdb = async (path, params = {}) => {
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  url.search = new URLSearchParams({ api_key: process.env.TMDB_API_KEY, ...params });
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
};

const popular = await fetchTmdb('/movie/popular', { language: 'es-ES', page: 1 });
console.log(popular.results[0]);
```

## Planificación de implementación (client-side)
1. Estructura de llamadas a TMDB usando funciones comunes:
   - `/trending/{media_type}/{time_window}`
   - `/movie/popular`
   - `/search/movie` (query + page + language)
   - `/{type}/{id}` (movie/tv)
2. Parámetros de listados:
   - Filtros comunes: `language`, `region`, `year`, `vote_average.gte`, `with_genres`.
   - Paginación: `page` + `total_pages` (navegación en UI)
   - Orden: `/discover/movie?sort_by=popularity.desc`.
3. UI y experiencia:
   - Skeleton de carga para listas y detalle.
   - Dropdown modernos para filtros por género, año, rating.
   - Modo claro / oscuro + temas:
     - color primario: `#e50914` (red Netflix)
     - color secundario: `#221f1f`/`#f5f5f1`.
   - Cards de películas con `poster`, `title`, `year`, `rating`.

## Reglas de normalización y transformación (TMDB -> App)
- `id` -> `id` (entero).
- `title`/`name` -> `title`.
- `overview` -> `overview` (fallback `"Sin descripción disponible"`).
- `poster_path` -> `poster` (`${IMG_BASE}${poster_path}` o placeholder si null).
- `release_date` / `first_air_date` -> `year` (subcadena 4 primeros, `"N/A"` si inválido).
- `genre_ids` -> `genres` (nombres mediante `/genre/movie/list` / `/genre/tv/list` + caché local).
- `vote_average` -> `rating` (1 decimal, límite 0-10).
- `original_language` -> `language`.

## Ejemplo completo de antes/después
### Antes (TMDB raw)
```json
{
  "id": 550,
  "title": "Fight Club",
  "overview": "An insomniac, ...",
  "poster_path": "/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg",
  "release_date": "1999-10-15",
  "genre_ids": [18, 53],
  "vote_average": 8.4
}
```

### Después (App normalizado)
```json
{
  "id": 550,
  "title": "Fight Club",
  "overview": "An insomniac, ...",
  "poster": "https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg",
  "year": "1999",
  "genres": ["Drama", "Thriller"],
  "rating": 8.4
}
```

## Checklist de UX / calidad de datos
- [ ] Paginación funciona (página anterior/siguiente con estado).
- [ ] Filtros de género, año y rating aplicados en listados.
- [ ] Handling 429/500 con reintentos + mensaje de usuario.
- [ ] Skeleton de carga visible en todas las pantallas de lista.
- [ ] Dropdown accesibles y móviles.
- [ ] Tema claro/oscuro con colores primario/secundario definidos.
- [ ] Una sola fuente de datos: TMDB, transformada a modelo normalizado.

