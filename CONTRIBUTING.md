# Contributing

¡Gracias por tu interés en contribuir! Por favor, lee las siguientes pautas.

## Cómo Contribuir

### Reportar Bugs

1. Verifica si el bug ya ha sido reportado
2. Si no, abre un nuevo issue con título descriptivo
3. Incluye:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Logs si están disponibles
   - Tu entorno (OS, Node version, etc)

### Sugerir Mejoras

1. Abre un issue con el tag `enhancement`
2. Describe claramente la mejora propuesta
3. Explica el caso de uso
4. Lista posibles alternativas

### Enviar Pull Requests

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Haz commits descriptivos
4. Push a la rama
5. Abre un Pull Request

#### Guía de Commit

```
- Usa presente: "Add feature" no "Added feature"
- Usa imperativo: "Move cursor to..." no "Moves cursor to..."
- Límita la primera línea a 72 caracteres
- Incluye mensaje detallado si es necesario
```

#### Requerimientos para PR

- [ ] Código sigue los estándares del proyecto
- [ ] Tests agregados/actualizados
- [ ] Documentación actualizada
- [ ] Commits son atómicos y descriptivos
- [ ] Merge conflicts resueltos

## Estándares de Código

### TypeScript

```typescript
// Usa interfaces explícitas
interface IMyInterface {
  property: string;
}

// Usa enums para valores fijos
enum Status {
  Active = 'active',
  Inactive = 'inactive',
}

// Documenta funciones públicas
/**
 * Descripción de qué hace
 * @param param1 - Descripción
 * @returns Descripción de retorno
 */
function myFunction(param1: string): void {}
```

### Nombrado

- Clases: PascalCase (MyClass)
- Funciones: camelCase (myFunction)
- Constantes: UPPER_SNAKE_CASE (MY_CONSTANT)
- Interfaces: IPascalCase (IMyInterface)
- Archivos: kebab-case (my-file.ts)

### Imports

```typescript
// Ordenar imports
import { Module } from '@nestjs/common'; // Librerías externas
import { MyService } from './my.service'; // Código local
```

## Proceso de Revisión

1. Revisión automática (linter)
2. Revisión manual de código
3. Tests deben pasar
4. Merge después de aprobación

## Código de Conducta

Sé respetuoso, inclusivo y profesional. Cualquier comportamiento abusivo resultará en expulsión.

## Preguntas

Si tienes preguntas, abre una discussion o contacta al equipo.

---

¡Gracias por contribuir!
