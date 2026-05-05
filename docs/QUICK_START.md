# Guía de Inicio Rápido

Comienza a usar el backend en 5 minutos.

## Requisitos

- Node.js 18+ instalado
- npm o yarn
- Git
- Una base de datos (SQL Server o Oracle)

## Paso 1: Clonar y Instalar

```bash
# Clonar repositorio
git clone <repository-url>
cd backend-ls

# Instalar dependencias
npm install
```

## Paso 2: Configurar Base de Datos

### Opción A: SQL Server Local

```bash
# Windows - Docker Desktop
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123" \
  -p 1433:1433 -d mcr.microsoft.com/mssql/server:latest

# O usar docker-compose
docker-compose up -d
```

### Opción B: Usar SQL Server Online

Usar Azure SQL Database o RDS

## Paso 3: Crear Base de Datos

```bash
# SQL Server con sqlcmd
sqlcmd -S localhost -U sa -P YourPassword123 -Q "CREATE DATABASE legal_management"

# Ejecutar script
sqlcmd -S localhost -U sa -P YourPassword123 -d legal_management \
  -i scripts/01-create-tables-mssql.sql
```

## Paso 4: Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tus valores
nano .env
```

Valores por defecto para desarrollo local:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
DB_TYPE=mssql
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=YourPassword123
DB_DATABASE=legal_management
```

## Paso 5: Iniciar el Servidor

```bash
# Modo desarrollo (con hot reload)
npm run start:dev

# Servidor está listo en http://localhost:3000/api
```

## Paso 6: Probar API

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'

# Respuesta:
# {
#   "accessToken": "eyJhbGciOi...",
#   "user": {
#     "id": "550e8400...",
#     "email": "admin@example.com",
#     "role": "admin"
#   }
# }
```

### Usar Token

```bash
TOKEN="eyJhbGciOi..."

# Obtener todos los clientes
curl -X GET http://localhost:3000/api/clients \
  -H "Authorization: Bearer $TOKEN"
```

## Pasos Opcionales: Insertar Datos de Prueba

```bash
# Ejecutar script de datos
sqlcmd -S localhost -U sa -P YourPassword123 -d legal_management \
  -i scripts/03-seed-data-mssql.sql
```

## Verificar Instalación

```bash
# Health check
curl http://localhost:3000/health

# Info del servidor
curl http://localhost:3000/
```

## Próximos Pasos

1. **Crear usuario adicional**
   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{
       "email": "lawyer@example.com",
       "password": "securePass123",
       "role": "lawyer"
     }'
   ```

2. **Crear cliente**
   ```bash
   TOKEN="tu_token"
   curl -X POST http://localhost:3000/api/clients \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "rut": "12345678-K",
       "nombre": "Juan Pérez",
       "telefono": "+56912345678",
       "email": "juan@example.com"
     }'
   ```

3. **Crear caso**
   ```bash
   curl -X POST http://localhost:3000/api/cases \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "client_id": "998f7f2e-d847-4afd-bd7e-6d8d7f8e9f9f",
       "tipo": "Divorcio",
       "descripcion": "Caso de divorcio",
       "fecha_inicio": "2024-05-01T00:00:00Z"
     }'
   ```

## Herramientas Recomendadas

### Para Testing

- **Postman** - Cliente HTTP GUI
- **Insomnia** - Alternativa a Postman
- **Thunder Client** - Extensión VSCode

### Para Desarrollo

- **VSCode** - Editor de código
- **Rest Client Extension** - Extensión de VSCode para testing
- **SQL Server Management Studio** - Administrar BD

## Troubleshooting

### Error de conexión a BD

```bash
# Verificar que el servidor SQL está corriendo
# SQL Server en Docker
docker ps

# Verificar credenciales
sqlcmd -S localhost -U sa -P YourPassword123 -Q "SELECT @@VERSION"
```

### Error de puerto ya en uso

```bash
# Cambiar puerto en .env
PORT=3001

# O liberar puerto
# Windows: netstat -ano | findstr :3000
# Linux/Mac: lsof -i :3000
```

### Error de JWT_SECRET

```bash
# JWT_SECRET debe tener al menos 32 caracteres en producción
JWT_SECRET=your-very-long-secret-key-with-32-characters-minimum
```

## Estructura de Respuestas

### Éxito (200)

```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "..."
  },
  "timestamp": "2024-05-01T12:00:00.000Z"
}
```

### Error (400, 404, 500)

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Recurso no encontrado",
  "timestamp": "2024-05-01T12:00:00.000Z",
  "path": "/api/users/123"
}
```

## Documentación Completa

- [README.md](../README.md) - Visión general
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Configuración de BD
- [API_EXAMPLES.md](./API_EXAMPLES.md) - Ejemplos de endpoints
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Guía de desarrollo
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Despliegue
- [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md) - Características futuras

## Obtener Ayuda

```bash
# Ver estructura del proyecto
tree src/

# Ver logs detallados
npm run start:dev 2>&1 | grep -i error

# Verificar configuración
npm run build
```

## Siguientes Pasos

1. ✅ Backend configurado y funcionando
2. 📚 Lee la guía de desarrollo
3. 🔧 Personaliza según tus necesidades
4. 🚀 Despliega en servidor
5. 📱 Crea cliente frontend

¡Listo para empezar!
