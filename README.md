# Legal Management System API

![NestJS](https://img.shields.io/badge/nest-10.2.10-red)
![TypeScript](https://img.shields.io/badge/typescript-5.2.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Backend profesional para gestión de casos legales y clientes. Desarrollado con NestJS, arquitectura modular y preparado para producción.

## 🎯 Características

✅ **Autenticación y Seguridad**
- JWT con Passport
- Contraseñas encriptadas con bcrypt
- Guards para protección de endpoints
- Control de roles y permisos

✅ **Arquitectura Modular**
- Módulos independientes (Auth, Users, Clients, Cases)
- Separación clara de responsabilidades
- DTOs y validaciones automáticas
- Capa de acceso a datos abstracción

✅ **Base de Datos**
- Soporte para SQL Server y Oracle DB
- Scripts SQL incluidos
- Datos de prueba listos
- Índices y relaciones optimizadas

✅ **Documentación Completa**
- Guía de inicio rápido
- Ejemplos de API
- Guía de desarrollo
- Guía de deployment
- Documentación de seguridad

✅ **Desarrollo Profesional**
- Docker y docker-compose
- Logging integrado
- Interceptores de logging y transformación
- Manejo robusto de errores
- Tests preparados

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- Git
- SQL Server 2019+ o Oracle DB 12c+

## 🚀 Inicio Rápido

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd backend-ls

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Crear base de datos (opcional - usar docker-compose)
docker-compose up -d

# 5. Ejecutar scripts SQL
sqlcmd -S localhost -U sa -P YourPassword123 -d legal_management \
  -i scripts/01-create-tables-mssql.sql

# 6. Iniciar servidor
npm run start:dev

# Servidor en: http://localhost:3000/api
```

Ver [docs/QUICK_START.md](docs/QUICK_START.md) para guía completa.

## 📁 Estructura del Proyecto

```
src/
├── auth/              # Autenticación JWT
├── users/             # Gestión de usuarios
├── clients/           # Gestión de clientes
├── cases/             # Gestión de casos legales
├── common/            # Guards, interceptors, decorators
├── database/          # Capa de acceso a datos
├── config/            # Configuración
├── types/             # Interfaces y tipos
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

## 🔌 API Endpoints

### Autenticación
```
POST   /api/auth/login           Login
```

### Usuarios
```
GET    /api/users                Listar usuarios
POST   /api/users                Crear usuario
GET    /api/users/:id            Obtener usuario
GET    /api/users/email/:email   Buscar por email
PUT    /api/users/:id            Actualizar usuario
DELETE /api/users/:id            Eliminar usuario
```

### Clientes
```
GET    /api/clients              Listar clientes
POST   /api/clients              Crear cliente
GET    /api/clients/:id          Obtener cliente
PUT    /api/clients/:id          Actualizar cliente
DELETE /api/clients/:id          Eliminar cliente
```

### Casos
```
GET    /api/cases                Listar casos
POST   /api/cases                Crear caso
GET    /api/cases/:id            Obtener caso
GET    /api/cases/client/:id     Casos por cliente
PUT    /api/cases/:id            Actualizar caso
PATCH  /api/cases/:id/status     Cambiar estado
DELETE /api/cases/:id            Eliminar caso
GET    /api/cases/stats          Estadísticas
```

Ver [docs/API_EXAMPLES.md](docs/API_EXAMPLES.md) para ejemplos completos.

## 🔐 Seguridad

- JWT para autenticación
- bcrypt para contraseñas
- Validación de entrada con DTOs
- CORS configurable
- Guards para autorización
- Manejo robusto de errores

Ver [docs/SECURITY.md](docs/SECURITY.md) para detalles.

## 📦 Instalación de Dependencias

```bash
# Desarrollo
npm run start:dev

# Build para producción
npm run build

# Producción
npm run start:prod

# Testing
npm test
npm run test:cov

# Linting
npm run lint

# Formatting
npm run format
```

## 🐳 Docker

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [QUICK_START.md](docs/QUICK_START.md) | Inicio en 5 minutos |
| [DATABASE_SETUP.md](docs/DATABASE_SETUP.md) | Configuración de BD |
| [API_EXAMPLES.md](docs/API_EXAMPLES.md) | Ejemplos de endpoints |
| [DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md) | Guía de desarrollo |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Despliegue en producción |
| [SECURITY.md](docs/SECURITY.md) | Mejores prácticas de seguridad |
| [ADVANCED_FEATURES.md](docs/ADVANCED_FEATURES.md) | Características futuras |

## 🛠️ Configuración

Ver [.env.example](.env.example) para variables disponibles:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key
DB_TYPE=mssql
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=YourPassword123
DB_DATABASE=legal_management
```

## 🧪 Testing

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 📝 Contribuir

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para pautas de contribución.

## 🎓 Aprendizaje

Este proyecto es una base profesional para:
- Aprender NestJS y arquitectura modular
- Entender autenticación JWT
- Implementar CRUD operations
- Trabajar con bases de datos
- Deployment en producción

## 🤝 Soporte

- 📧 Email: support@example.com
- 💬 Issues: GitHub Issues
- 📖 Docs: [Documentación](docs/)

## 📄 Licencia

MIT - Ver [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

Legal Management System Team

---

**⭐ Si te fue útil, considera dejar una estrella!**

Hecho con ❤️ para la gestión legal profesional
