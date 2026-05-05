# Project Directory Structure

Estructura final del proyecto Backend Legal Management System

```
backend-ls/
├── docs/
│   ├── ADVANCED_FEATURES.md      # Características futuras (Puppeteer, reportes, etc)
│   ├── API_EXAMPLES.md            # Ejemplos completos de endpoints
│   ├── DATABASE_SETUP.md           # Configuración de SQL Server y Oracle
│   ├── DEPLOYMENT.md              # Guía de deployment en producción
│   ├── DEVELOPMENT_GUIDE.md        # Guía completa de desarrollo
│   ├── QUICK_START.md             # Inicio rápido en 5 minutos
│   └── SECURITY.md                # Mejores prácticas de seguridad
│
├── scripts/
│   ├── 01-create-tables-mssql.sql # Script para crear tablas en SQL Server
│   ├── 02-create-tables-oracle.sql # Script para crear tablas en Oracle
│   └── 03-seed-data-mssql.sql     # Datos de prueba
│
├── src/
│   ├── auth/                      # Módulo de Autenticación
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   │   └── login.dto.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── local-auth.guard.ts
│   │   └── strategies/
│   │       ├── jwt.strategy.ts
│   │       └── local.strategy.ts
│   │
│   ├── cases/                     # Módulo de Casos Legales
│   │   ├── cases.controller.ts
│   │   ├── cases.module.ts
│   │   ├── cases.service.ts
│   │   ├── dto/
│   │   │   ├── change-case-status.dto.ts
│   │   │   ├── create-case.dto.ts
│   │   │   └── update-case.dto.ts
│   │   └── entities/
│   │       └── case.entity.ts
│   │
│   ├── clients/                   # Módulo de Clientes
│   │   ├── clients.controller.ts
│   │   ├── clients.module.ts
│   │   ├── clients.service.ts
│   │   ├── dto/
│   │   │   ├── create-client.dto.ts
│   │   │   └── update-client.dto.ts
│   │   └── entities/
│   │       └── client.entity.ts
│   │
│   ├── common/                    # Código Compartido
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── exceptions/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   └── roles.guard.ts
│   │   └── interceptors/
│   │       ├── logging.interceptor.ts
│   │       └── transform.interceptor.ts
│   │
│   ├── config/                    # Configuración
│   │   └── configuration.ts
│   │
│   ├── database/                  # Capa de Acceso a Datos
│   │   ├── database.module.ts
│   │   └── database.service.ts
│   │
│   ├── types/                     # Interfaces y Tipos
│   │   └── index.ts
│   │
│   ├── users/                     # Módulo de Usuarios
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   └── entities/
│   │       └── user.entity.ts
│   │
│   ├── app.controller.ts          # Controlador principal
│   ├── app.module.ts              # Módulo raíz
│   ├── app.service.ts             # Servicio principal
│   └── main.ts                    # Punto de entrada
│
├── test/
│   ├── app.e2e-spec.ts           # Tests E2E
│   └── jest-e2e.json             # Configuración Jest E2E
│
├── .env                           # Variables de entorno (desarrollo)
├── .env.example                   # Plantilla de variables de entorno
├── .eslintignore                  # Archivos a ignorar en ESLint
├── .eslintrc.js                   # Configuración de ESLint
├── .gitignore                     # Archivos a ignorar en Git
├── .prettierignore                # Archivos a ignorar en Prettier
├── .prettierrc                    # Configuración de Prettier
├── CHANGELOG.md                   # Historial de cambios
├── CONTRIBUTING.md                # Guía de contribución
├── Dockerfile                     # Imagen Docker
├── LICENSE                        # Licencia MIT
├── README.md                      # Documentación principal
├── docker-compose.yml             # Docker Compose (servicios)
├── nest-cli.json                  # Configuración de NestJS CLI
├── package.json                   # Dependencias y scripts
├── tsconfig.json                  # Configuración de TypeScript
└── tsconfig.build.json            # Configuración TypeScript build
```

## Estructura de Módulos

### Cada módulo tiene:
```
modulo/
├── modulo.controller.ts      # Maneja peticiones HTTP
├── modulo.module.ts          # Configuración del módulo
├── modulo.service.ts         # Lógica de negocio
├── entities/
│   └── modulo.entity.ts      # Estructura de datos
└── dto/
    ├── create-modulo.dto.ts  # Validación para CREATE
    └── update-modulo.dto.ts  # Validación para UPDATE
```

## Archivos de Configuración

| Archivo | Propósito |
|---------|-----------|
| package.json | Dependencias y scripts npm |
| tsconfig.json | Configuración de TypeScript |
| .eslintrc.js | Reglas de linting |
| .prettierrc | Formato de código |
| nest-cli.json | Configuración de NestJS CLI |
| docker-compose.yml | Servicios (SQL Server, Redis) |
| Dockerfile | Imagen Docker para producción |
| .env | Variables de entorno (local) |
| .env.example | Plantilla de variables |

## Documentación

| Archivo | Contenido |
|---------|----------|
| README.md | Overview y características |
| QUICK_START.md | Guía de 5 minutos |
| DATABASE_SETUP.md | Configuración de BD |
| API_EXAMPLES.md | Ejemplos de endpoints |
| DEVELOPMENT_GUIDE.md | Guía para developers |
| DEPLOYMENT.md | Deploy a producción |
| SECURITY.md | Mejores prácticas |
| ADVANCED_FEATURES.md | Roadmap futuro |
| CONTRIBUTING.md | Cómo contribuir |
| CHANGELOG.md | Historial de cambios |

## Conteo de Archivos

- **Archivos TypeScript**: 38
- **Archivos de Documentación**: 10
- **Scripts SQL**: 3
- **Archivos de Configuración**: 12
- **Total**: 63+ archivos

## Espacios de Nombres (Paths)

```json
{
  "paths": {
    "@/*": ["src/*"]
  }
}
```

Permite usar:
```typescript
import { AuthService } from '@/auth/auth.service';
import { DatabaseService } from '@/database/database.service';
```

## Scripts Disponibles

```bash
npm run build          # Compilar a JavaScript
npm run format         # Formatear código
npm run start          # Iniciar en producción
npm run start:dev      # Iniciar en desarrollo
npm run start:debug    # Iniciar en debug
npm run start:prod     # Iniciar compilado en producción
npm run lint           # Verificar linting
npm test               # Ejecutar unit tests
npm run test:watch    # Tests en modo watch
npm run test:cov      # Tests con coverage
npm run test:e2e      # Tests E2E
```

## Base de Datos

### Tablas
- **users**: 7 campos
- **clients**: 7 campos
- **cases**: 9 campos

### Índices
- 2 índices en users (email)
- 3 índices en clients (rut, nombre, email)
- 3 índices en cases (client_id, estado, fecha_inicio)

### Relaciones
- cases.client_id → clients.id (FK)
- cases.usuario_id → users.id (FK) [Opcional]

## Dependencias Principales

- @nestjs/common@10.2.10
- @nestjs/jwt@11.0.0
- @nestjs/passport@10.0.3
- typescript@5.2.2
- class-validator@0.14.0
- bcrypt@5.1.1
- passport@0.7.0
- uuid@9.0.0

## Versiones Recomendadas

- Node.js: 18 LTS o superior
- npm: 9+ o yarn
- SQL Server: 2019 o superior
- Oracle: 12c o superior

## Información del Proyecto

| Propiedad | Valor |
|-----------|-------|
| Nombre | Legal Management System |
| Descripción | Backend de gestión legal |
| Versión | 1.0.0 |
| Licencia | MIT |
| Autor | Legal Team |
| Node | >= 18 |
| TypeScript | 5.2.2 |
| NestJS | 10.2.10 |
