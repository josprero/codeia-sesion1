# Política de Dependencias

## Gestión de Dependencias

### Tipos de Dependencias
- **Dependencies**: Librerías requeridas en producción
- **DevDependencies**: Herramientas de desarrollo y testing
- **PeerDependencies**: Dependencias que deben ser instaladas por el consumidor
- **OptionalDependencies**: Dependencias opcionales

### Versionado de Dependencias
- Usar versiones específicas (no ranges como `^` o `~`)
- Actualizar dependencias regularmente (semanal/mensual)
- Revisar changelogs antes de actualizar
- Usar `npm audit` o `yarn audit` para vulnerabilidades

## Version Bump Policy

### Automático vs Manual
- **Patch updates**: Automático (CI/CD)
- **Minor updates**: Manual review requerido
- **Major updates**: Manual review y testing extensivo

### Proceso de Update
1. **Identificar updates disponibles**
   ```bash
   npm outdated
   yarn outdated
   ```

2. **Revisar changelogs**
   - Verificar breaking changes
   - Evaluar impacto en el código

3. **Testing**
   - Ejecutar suite completa de tests
   - Verificar funcionalidad manualmente
   - Performance testing si aplica

4. **Commit y Release**
   - Commit: `chore(deps): update axios to 1.4.0`
   - Crear PR para review
   - Merge y release según política de versionado

### Dependencias Críticas
- **axios/fetch**: Para API calls - actualizar con cuidado
- **react/vue**: Framework principal - seguir LTS
- **testing libraries**: jest, cypress - mantener actualizado
- **build tools**: webpack, vite - actualizar para performance

### Security Updates
- **Prioridad alta**: Actualizar inmediatamente
- **Proceso**: `npm audit fix` o manual update
- **Testing**: Verificar que no rompe funcionalidad

### Lockfiles
- **package-lock.json** o **yarn.lock**: Siempre commit
- **Integrity**: Verificar checksums
- **CI/CD**: Usar lockfile para builds consistentes

### Monorepos y Workspaces
- Usar workspaces para proyectos relacionados
- Versionado independiente por paquete
- Dependencias compartidas en root