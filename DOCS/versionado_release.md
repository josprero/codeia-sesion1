# Políticas de versionado y release notes

## SemVer
- Formato: `MAJOR.MINOR.PATCH`
- Incompatible: MAJOR++
- Nuevas funciones (retro compatibles): MINOR++
- Correcciones de bugs: PATCH++

## Tagging
- `vN.N.N` en commits liberados.
- `vN.N.N-rc.X` para release candidates.

## Release notes
- Incluir en changelog breve:
  - feat: Descripción
  - fix: Descripción
  - docs: Descripción
- Mantener en un archivo `RELEASE_NOTES.md` o `CHANGELOG.md`.

## Revisión
- Antes de cada release, comprobar tests automatizados y lint.
- Generar notas con `git log --oneline vX.Y.Z..HEAD`.
