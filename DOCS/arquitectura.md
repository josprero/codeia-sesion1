# Arquitectura del sistema (legacy)

## Vista general
- Backend: Node.js + Express (Legacy)
- Servicios:
  - `tmdb-service`: acceso a TMDB y normalización de datos
  - `cache-service`: Cache en memoria/Redis
  - `api-gateway`: endpoints expuestos al frontend

## Responsabilidades
- `tmdb-service`
  - Consumo de API TMDB
  - Gestión de límites y errores
  - Transformación de respuestas al modelo normalizado

- `cache-service`
  - Cachear respuestas de rutas de alto volumen
  - Evitar múltiples llamadas a TMDB en minutos

- `api-gateway`
  - Rutas públicas y autenticación
  - Orquestación de servicios internos
  - Agregar política CORS, rate limit local

## Diagrama
- No se puede insertar un diagrama gráfico directo en Markdown aquí, se recomienda usar un archivo `archi.drawio`.
- Descripción textual:
  - Cliente <-> API Gateway -> TMDB Service -> TMDB (externe)
  - API Gateway <-> Cache Service (lectura/escritura)

## Legacy notes
- Revisión pendiente: migrar `tmdb-service` a microservicio independiente y desacoplar del monolito.
