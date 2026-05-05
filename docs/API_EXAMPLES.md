# Ejemplos de Uso de API

Este documento contiene ejemplos de cómo usar los endpoints de la API.

## Autenticación

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}

# Response 200 OK
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "admin@example.com",
      "role": "admin"
    }
  },
  "timestamp": "2024-05-01T12:00:00.000Z"
}
```

## Usuarios

### Crear Usuario

```bash
POST /api/users
Content-Type: application/json

{
  "email": "lawyer@example.com",
  "password": "securePassword123",
  "role": "lawyer"
}

# Response 201 Created
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "lawyer@example.com",
    "role": "lawyer",
    "created_at": "2024-05-01T12:00:00.000Z",
    "updated_at": "2024-05-01T12:00:00.000Z"
  }
}
```

### Obtener Usuario por ID

```bash
GET /api/users/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <token>

# Response 200 OK
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "lawyer@example.com",
    "role": "lawyer",
    "created_at": "2024-05-01T12:00:00.000Z",
    "updated_at": "2024-05-01T12:00:00.000Z"
  }
}
```

### Buscar Usuario por Email

```bash
GET /api/users/email/lawyer@example.com
Authorization: Bearer <token>

# Response 200 OK
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "lawyer@example.com",
    "role": "lawyer",
    "created_at": "2024-05-01T12:00:00.000Z",
    "updated_at": "2024-05-01T12:00:00.000Z"
  }
}
```

### Actualizar Usuario

```bash
PUT /api/users/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json
Authorization: Bearer <token>

{
  "email": "lawyer_updated@example.com",
  "role": "lawyer"
}

# Response 200 OK
```

### Eliminar Usuario

```bash
DELETE /api/users/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <token>

# Response 204 No Content
```

## Clientes

### Crear Cliente

```bash
POST /api/clients
Content-Type: application/json
Authorization: Bearer <token>

{
  "rut": "12345678-K",
  "nombre": "Juan Pérez",
  "telefono": "+56912345678",
  "email": "juan@example.com"
}

# Response 201 Created
{
  "success": true,
  "data": {
    "id": "998f7f2e-d847-4afd-bd7e-6d8d7f8e9f9f",
    "rut": "12345678-K",
    "nombre": "Juan Pérez",
    "telefono": "+56912345678",
    "email": "juan@example.com",
    "created_at": "2024-05-01T12:00:00.000Z",
    "updated_at": "2024-05-01T12:00:00.000Z"
  }
}
```

### Obtener Todos los Clientes

```bash
GET /api/clients
Authorization: Bearer <token>

# Response 200 OK
{
  "success": true,
  "data": [
    {
      "id": "998f7f2e-d847-4afd-bd7e-6d8d7f8e9f9f",
      "rut": "12345678-K",
      "nombre": "Juan Pérez",
      "telefono": "+56912345678",
      "email": "juan@example.com",
      "created_at": "2024-05-01T12:00:00.000Z",
      "updated_at": "2024-05-01T12:00:00.000Z"
    }
  ]
}
```

### Obtener Cliente por ID

```bash
GET /api/clients/998f7f2e-d847-4afd-bd7e-6d8d7f8e9f9f
Authorization: Bearer <token>
```

### Buscar Cliente por RUT

```bash
GET /api/clients/search/rut?rut=12345678-K
Authorization: Bearer <token>
```

### Actualizar Cliente

```bash
PUT /api/clients/998f7f2e-d847-4afd-bd7e-6d8d7f8e9f9f
Content-Type: application/json
Authorization: Bearer <token>

{
  "nombre": "Juan Pérez López",
  "telefono": "+56987654321"
}
```

### Eliminar Cliente

```bash
DELETE /api/clients/998f7f2e-d847-4afd-bd7e-6d8d7f8e9f9f
Authorization: Bearer <token>

# Response 204 No Content
```

### Obtener Total de Clientes

```bash
GET /api/clients/stats/count
Authorization: Bearer <token>

# Response 200 OK
{
  "success": true,
  "data": {
    "total": 5
  }
}
```

## Casos Legales

### Crear Caso

```bash
POST /api/cases
Content-Type: application/json
Authorization: Bearer <token>

{
  "client_id": "998f7f2e-d847-4afd-bd7e-6d8d7f8e9f9f",
  "tipo": "Divorcio",
  "estado": "abierto",
  "descripcion": "Caso de divorcio contencioso",
  "fecha_inicio": "2024-05-01T00:00:00Z",
  "fecha_fin": "2024-12-31T00:00:00Z"
}

# Response 201 Created
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6",
    "client_id": "998f7f2e-d847-4afd-bd7e-6d8d7f8e9f9f",
    "tipo": "Divorcio",
    "estado": "abierto",
    "descripcion": "Caso de divorcio contencioso",
    "fecha_inicio": "2024-05-01T00:00:00.000Z",
    "fecha_fin": "2024-12-31T00:00:00.000Z",
    "created_at": "2024-05-01T12:00:00.000Z",
    "updated_at": "2024-05-01T12:00:00.000Z"
  }
}
```

### Obtener Todos los Casos

```bash
GET /api/cases
Authorization: Bearer <token>
```

### Obtener Caso por ID

```bash
GET /api/cases/a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6
Authorization: Bearer <token>
```

### Obtener Casos por Cliente

```bash
GET /api/cases/client/998f7f2e-d847-4afd-bd7e-6d8d7f8e9f9f
Authorization: Bearer <token>
```

### Actualizar Caso

```bash
PUT /api/cases/a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6
Content-Type: application/json
Authorization: Bearer <token>

{
  "estado": "en_progreso",
  "descripcion": "Caso en progreso"
}
```

### Cambiar Estado del Caso

```bash
PATCH /api/cases/a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6/status
Content-Type: application/json
Authorization: Bearer <token>

{
  "estado": "cerrado"
}

# Estados válidos: abierto, en_progreso, cerrado, pausado
```

### Eliminar Caso

```bash
DELETE /api/cases/a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6
Authorization: Bearer <token>

# Response 204 No Content
```

### Obtener Estadísticas de Casos

```bash
GET /api/cases/stats
Authorization: Bearer <token>

# Response 200 OK
{
  "success": true,
  "data": {
    "total": 10,
    "abiertos": 5,
    "cerrados": 3,
    "en_progreso": 2
  }
}
```

## Manejo de Errores

### Error de Validación

```bash
POST /api/users
Content-Type: application/json

{
  "email": "invalid-email",
  "password": "123"
}

# Response 400 Bad Request
{
  "success": false,
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "timestamp": "2024-05-01T12:00:00.000Z",
  "path": "/api/users"
}
```

### Token Expirado

```bash
GET /api/users
Authorization: Bearer <expired_token>

# Response 401 Unauthorized
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized",
  "timestamp": "2024-05-01T12:00:00.000Z",
  "path": "/api/users"
}
```

### Recurso No Encontrado

```bash
GET /api/users/nonexistent-id
Authorization: Bearer <token>

# Response 404 Not Found
{
  "success": false,
  "statusCode": 404,
  "message": "Usuario con ID nonexistent-id no encontrado",
  "timestamp": "2024-05-01T12:00:00.000Z",
  "path": "/api/users/nonexistent-id"
}
```

## Usando cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Crear cliente (con token)
TOKEN="your_jwt_token"
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
