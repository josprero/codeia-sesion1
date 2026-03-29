# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Release plan
- **0.2.0 (target 2026-04-10)**: TMDB API proxy + Node/dotenv, endpoints para home, búsqueda, detalle, filtros básicos, paginación, skeletons, dropdowns modernos, tema light/dark.
- **0.3.0 (target 2026-05-01)**: Cuenta de usuario, watchlist/rating, infinite scrolling, cache avanzadas y pruebas E2E.

### Added
- Initial project setup
- TMDB API integration documentation
- Data model normalization rules
- Documentación API endpoints con reglas de consumo y UI (filtros, paginación, skeleton, dropdown, modo claro/oscuro)

### Changed
- Update architecture diagram

### Fixed
- Fix data transformation edge cases

## [0.1.0] - 2023-12-01

### Added
- feat(api): add TMDB movie search endpoint
- feat(api): add popular movies endpoint
- feat(db): create normalized movie schema
- docs(api): document API endpoints and limits

### Changed
- refactor(data): improve movie data transformation
- chore(deps): update axios to 1.4.0

### Fixed
- fix(api): handle API rate limiting
- fix(data): correct genre mapping logic

### Security
- Update dependencies for security patches