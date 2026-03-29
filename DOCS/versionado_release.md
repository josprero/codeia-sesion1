# Política de Versionado y Releases

## Versionado Semántico (SemVer)

### Formato: MAJOR.MINOR.PATCH
- **MAJOR**: Cambios incompatibles (breaking changes)
- **MINOR**: Nuevas funcionalidades compatibles
- **PATCH**: Correcciones de bugs compatibles

### Ejemplos
- `1.0.0`: Release inicial
- `1.1.0`: Agregar nueva funcionalidad (ej: búsqueda avanzada)
- `1.1.1`: Corregir bug en la búsqueda
- `2.0.0`: Cambiar API completamente

## Política de Versionado

### Cuando Incrementar MAJOR
- Cambios en la API que rompen compatibilidad
- Remover funcionalidades existentes
- Cambios significativos en la arquitectura

### Cuando Incrementar MINOR
- Agregar nuevas funcionalidades
- Mejoras que no rompen compatibilidad
- Nuevos endpoints o campos

### Cuando Incrementar PATCH
- Correcciones de bugs
- Mejoras de performance menores
- Cambios internos que no afectan la API

## Tags y Releases

### Convención de Tags
- Tags: `vMAJOR.MINOR.PATCH` (ej: `v1.2.3`)
- Pre-releases: `v1.2.3-alpha.1`, `v1.2.3-beta.1`
- Release candidates: `v1.2.3-rc.1`

### Proceso de Release
1. **Preparación**
   - Asegurar que develop branch está estable
   - Ejecutar suite completa de tests
   - Actualizar CHANGELOG.md

2. **Creación del Tag**
   ```bash
   git checkout main
   git pull origin main
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

3. **GitHub Release**
   - Crear release desde el tag
   - Incluir release notes automáticas desde CHANGELOG
   - Adjuntar assets si es necesario (binarios, etc.)

## Release Notes

### Formato
```
## [v1.0.0] - 2023-12-01

### Added
- Nueva funcionalidad de búsqueda de películas
- Integración con TMDB API

### Changed
- Mejorar performance de queries

### Fixed
- Corregir bug en transformación de datos

### Removed
- Remover código legacy obsoleto
```

### Generación Automática
- Usar conventional commits para generar release notes
- Herramientas: `standard-version`, `semantic-release`
- Integrar con CI/CD para releases automáticas