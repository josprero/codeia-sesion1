# Plan de Commits y Puntos de Tag

## Estrategia de Commits

### Formato de Commit Messages
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Tipos de Commits
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de estilo (formateo, etc.)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

### Ejemplos de Commits
- `feat(api): add TMDB movie search endpoint`
- `fix(data): handle null values in movie transformation`
- `docs(api): update endpoint documentation`
- `refactor(db): normalize movie-genre relationships`
- `test(api): add unit tests for movie controller`

## Puntos de Tag

### Versionado Semántico
- `v1.0.0`: Primera release estable
- `v1.1.0`: Nueva funcionalidad (API de búsqueda)
- `v1.1.1`: Hotfix para bug en transformación de datos
- `v2.0.0`: Breaking changes (cambio de arquitectura)

### Cuándo Hacer Tags
- Después de completar una feature completa
- Antes de releases importantes
- Para puntos de estabilidad en desarrollo
- Al finalizar sprints o milestones

### Proceso de Tag
1. Asegurar que todos los tests pasan
2. Actualizar CHANGELOG.md
3. Crear tag: `git tag -a v1.0.0 -m "Release v1.0.0"`
4. Push tag: `git push origin v1.0.0`
5. Crear release en GitHub con release notes