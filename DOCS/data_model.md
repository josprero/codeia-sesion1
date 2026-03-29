# Modelo de datos normalizado y reglas de transformación

## Entidades principales
- `Movie` (ID TMDB, título, sinopsis, fecha estreno, género ids, director, voto promedio)
- `Genre` (ID, nombre)
- `Person` (ID, nombre, rol)
- `Configuration` (base_url, tamaños de imagen)

## Normalización
1. `Movie` almacena referencias a `Genre` a través de `genre_ids`.
2. Separar `Credits` en `Cast` y `Crew` con `movie_id` como FK.
3. Evitar datos repetidos de imágenes; almacenar solo `poster_path`, reconstruir URL con `configuration`.

## Reglas de transformación
- `tmdb /movie/{id}` → `Movie`:
  - `release_date` -> `releaseDate` (iso date); si vacío `null`
  - `vote_average` -> `rating`
  - `genre_ids` -> `genres` mediante `Genre` en cache.

- Caso de `search/movie`:
  - Mapeo de cada item a `MovieSummary` (subset de campos): id, title, overview, releaseDate, posterPath.

## Ejemplo JSON normalizado
```json
{
  "Movie": {
    "id": 550,
    "title": "Fight Club",
    "overview": "An insomniac office worker...",
    "releaseDate": "1999-10-15",
    "genres": [28, 18],
    "posterPath": "/kpt....jpg",
    "rating": 8.4
  }
}
```
