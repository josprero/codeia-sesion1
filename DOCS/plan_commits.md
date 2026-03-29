# Plan de commits y puntos de tag

## Convenciones de commit
- `feat:` para nuevas funcionalidades.
- `fix:` para correcciones.
- `refactor:` para cambios sin comportamiento.
- `docs:` para documentación.
- `chore:` para tareas de infraestructura.

## Flujo de trabajo
1. `main` siempre en estado estable.
2. Ramificación por feature: `feature/<nombre>`.
3. Pull request con descripción y referencias a tickets.

## Estrategia de tags
- Tag cada release: `v<major>.<minor>.<patch>`.
- Tag intermedio para hitos mayores: `v<major>.<minor>.0-beta`.

## Puntos de control
- Tag de MVP: `v1.0.0`
- Tag de soporte: `v1.0.1`, `v1.1.0`, etc.
- Tag de parche urgente en `main` y backport a `develop`.
