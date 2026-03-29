# Política de dependencias y version bump

## Gestión de dependencias
- Mantener `package.json` con versiones fijas (`^` o exactas, según riesgo).
- Priorizar actualizaciones de seguridad con `npm audit fix` / `npm audit`.
- Revisar y eliminar dependencias no utilizadas.

## Version bump
- `patch`: corrección de bugs o ajuste de dependencias (`npm update`), sin cambios en API.
- `minor`: nuevas funciones que requieren dependencias nuevas o actualizaciones mayores compatibles.
- `major`: cambios incompatibles o migraciones de dependencias críticas (ej. Node 18->20).

## Proceso
1. Actualizar dependencia (y tests).
2. Ejecutar `npm test`.
3. Commit `chore(deps): upgrade <paquete> a <versión>`.
4. Tag apropiado según semver.
