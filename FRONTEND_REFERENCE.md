# 📋 Backend API Reference - Frontend Developer Guide

**Proyecto**: Sistema de Gestión Legal (Legal Management System)  
**Framework**: NestJS 10.2.10  
**Base de Datos**: PostgreSQL 15  
**API Version**: 1.0.0  
**Documentación Swagger**: http://localhost:3000/swagger

---

## 🔌 Configuración Base

```
🌐 URL Base:     http://localhost:3000/api
🔐 Autenticación: JWT Bearer Token
📦 Content-Type:  application/json
⏰ Ambiente:      development
🗄️  Base Datos:  PostgreSQL (LegalService)
```

### Variables de Entorno (Frontend)
```env
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
```

---

## 🔐 Autenticación

### 1. Login (Obtener Token)
```
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwic3ViIjoiYWE5ZWEzYzAtZTc1YS00ZTJjLWEwZDQtMWI3MzU3MDg4MzZiIiwiaWF0IjoxNzI3NzI2ODAzLCJleHAiOjE3Mjc4MTMyMDN9.signature",
  "user": {
    "id": "aa9ea3c0-e75a-4e2c-a0d4-1b73570883b",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Error Response (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

**Cómo usar el token en posteriores requests:**
```
Authorization: Bearer <access_token>
```

### Token Storage (Recomendaciones Frontend)
```javascript
// ✅ localStorage (Simple, persistente)
localStorage.setItem('token', access_token);

// ✅ sessionStorage (Sesión actual)
sessionStorage.setItem('token', access_token);

// ✅ Redux/Zustand (Estado global)
store.setToken(access_token);
```

### Configurar Axios/Fetch Interceptor
```javascript
// axios
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// fetch
fetch(url, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
```

---

## 👥 Módulo: USUARIOS

### 1. Crear Usuario
```
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "juan.perez@example.com",
  "password": "securePassword123",
  "role": "lawyer"
}
```

**Valid Roles:** `admin` | `lawyer` | `user`

**Success Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "juan.perez@example.com",
  "role": "lawyer",
  "created_at": "2026-05-01T21:46:43.000Z",
  "updated_at": "2026-05-01T21:46:43.000Z"
}
```

**Error Response (409):**
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

---

### 2. Listar Todos los Usuarios
```
GET /api/users
Authorization: Bearer {token}
```

**Success Response (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@example.com",
    "role": "admin",
    "created_at": "2026-05-01T20:00:00.000Z",
    "updated_at": "2026-05-01T20:00:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "email": "juan.perez@example.com",
    "role": "lawyer",
    "created_at": "2026-05-01T21:46:43.000Z",
    "updated_at": "2026-05-01T21:46:43.000Z"
  }
]
```

---

### 3. Obtener Usuario por ID
```
GET /api/users/{id}
Authorization: Bearer {token}
```

**URL Example:**
```
GET /api/users/550e8400-e29b-41d4-a716-446655440000
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@example.com",
  "role": "admin",
  "created_at": "2026-05-01T20:00:00.000Z",
  "updated_at": "2026-05-01T20:00:00.000Z"
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

---

### 4. Obtener Usuario por Email
```
GET /api/users/email/{email}
Authorization: Bearer {token}
```

**URL Example:**
```
GET /api/users/email/admin@example.com
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@example.com",
  "role": "admin",
  "created_at": "2026-05-01T20:00:00.000Z",
  "updated_at": "2026-05-01T20:00:00.000Z"
}
```

---

### 5. Actualizar Usuario
```
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body (todos los campos opcionales):**
```json
{
  "email": "nuevo@example.com",
  "password": "newPassword123",
  "role": "user"
}
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "nuevo@example.com",
  "role": "user",
  "created_at": "2026-05-01T20:00:00.000Z",
  "updated_at": "2026-05-01T22:10:00.000Z"
}
```

---

### 6. Eliminar Usuario
```
DELETE /api/users/{id}
Authorization: Bearer {token}
```

**URL Example:**
```
DELETE /api/users/550e8400-e29b-41d4-a716-446655440000
```

**Success Response (200):**
```json
{
  "message": "User deleted successfully",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## 👨‍💼 Módulo: CLIENTES

### 1. Crear Cliente
```
POST /api/clients
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "rut": "12345678-K",
  "nombre": "Juan Pérez García",
  "telefono": "+56912345678",
  "email": "juan.perez@example.com"
}
```

**Success Response (201):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "rut": "12345678-K",
  "nombre": "Juan Pérez García",
  "telefono": "+56912345678",
  "email": "juan.perez@example.com",
  "created_at": "2026-05-01T21:46:43.000Z",
  "updated_at": "2026-05-01T21:46:43.000Z"
}
```

**Error (409) - RUT existe:**
```json
{
  "statusCode": 409,
  "message": "RUT already exists",
  "error": "Conflict"
}
```

---

### 2. Listar Todos los Clientes
```
GET /api/clients
Authorization: Bearer {token}
```

**Success Response (200):**
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "rut": "12345678-K",
    "nombre": "Juan Pérez García",
    "telefono": "+56912345678",
    "email": "juan.perez@example.com",
    "created_at": "2026-05-01T21:46:43.000Z",
    "updated_at": "2026-05-01T21:46:43.000Z"
  }
]
```

---

### 3. Obtener Cliente por ID
```
GET /api/clients/{id}
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "rut": "12345678-K",
  "nombre": "Juan Pérez García",
  "telefono": "+56912345678",
  "email": "juan.perez@example.com",
  "created_at": "2026-05-01T21:46:43.000Z",
  "updated_at": "2026-05-01T21:46:43.000Z"
}
```

---

### 4. Buscar Cliente por RUT
```
GET /api/clients/search/rut?rut={rut}
Authorization: Bearer {token}
```

**URL Example:**
```
GET /api/clients/search/rut?rut=12345678-K
```

**Success Response (200):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "rut": "12345678-K",
  "nombre": "Juan Pérez García",
  "telefono": "+56912345678",
  "email": "juan.perez@example.com",
  "created_at": "2026-05-01T21:46:43.000Z",
  "updated_at": "2026-05-01T21:46:43.000Z"
}
```

---

### 5. Actualizar Cliente
```
PUT /api/clients/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body (todos opcionales):**
```json
{
  "nombre": "Juan Pérez García Actualizado",
  "telefono": "+56987654321",
  "email": "nuevo.email@example.com"
}
```

**Success Response (200):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "rut": "12345678-K",
  "nombre": "Juan Pérez García Actualizado",
  "telefono": "+56987654321",
  "email": "nuevo.email@example.com",
  "created_at": "2026-05-01T21:46:43.000Z",
  "updated_at": "2026-05-01T22:15:00.000Z"
}
```

---

### 6. Eliminar Cliente
```
DELETE /api/clients/{id}
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "Client deleted successfully",
  "id": "770e8400-e29b-41d4-a716-446655440002"
}
```

---

### 7. Obtener Cantidad de Clientes
```
GET /api/clients/stats/count
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "total": 5,
  "timestamp": "2026-05-01T21:46:43.000Z"
}
```

---

## ⚖️ Módulo: CASOS

### 1. Crear Caso
```
POST /api/cases
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "client_id": "770e8400-e29b-41d4-a716-446655440002",
  "tipo": "Demanda Civil",
  "estado": "abierto",
  "descripcion": "Demanda por incumplimiento de contrato de arrendamiento",
  "fecha_inicio": "2026-05-01",
  "fecha_fin": "2026-12-31"
}
```

**Valid Estados:** `abierto` | `en_progreso` | `cerrado` | `pausado`

**Success Response (201):**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "client_id": "770e8400-e29b-41d4-a716-446655440002",
  "tipo": "Demanda Civil",
  "estado": "abierto",
  "descripcion": "Demanda por incumplimiento de contrato de arrendamiento",
  "fecha_inicio": "2026-05-01",
  "fecha_fin": "2026-12-31",
  "created_at": "2026-05-01T21:46:43.000Z",
  "updated_at": "2026-05-01T21:46:43.000Z"
}
```

**Error (404) - Cliente no existe:**
```json
{
  "statusCode": 404,
  "message": "Client not found",
  "error": "Not Found"
}
```

---

### 2. Listar Todos los Casos
```
GET /api/cases
Authorization: Bearer {token}
```

**Query Parameters (opcionales):**
```
GET /api/cases?skip=0&take=10&estado=abierto
```

**Success Response (200):**
```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "client_id": "770e8400-e29b-41d4-a716-446655440002",
    "tipo": "Demanda Civil",
    "estado": "abierto",
    "descripcion": "Demanda por incumplimiento de contrato de arrendamiento",
    "fecha_inicio": "2026-05-01",
    "fecha_fin": "2026-12-31",
    "created_at": "2026-05-01T21:46:43.000Z",
    "updated_at": "2026-05-01T21:46:43.000Z"
  }
]
```

---

### 3. Obtener Estadísticas de Casos
```
GET /api/cases/stats
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "total": 10,
  "abierto": 5,
  "en_progreso": 3,
  "cerrado": 1,
  "pausado": 1,
  "fecha": "2026-05-01T21:46:43.000Z"
}
```

---

### 4. Obtener Caso por ID
```
GET /api/cases/{id}
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "client_id": "770e8400-e29b-41d4-a716-446655440002",
  "tipo": "Demanda Civil",
  "estado": "abierto",
  "descripcion": "Demanda por incumplimiento de contrato de arrendamiento",
  "fecha_inicio": "2026-05-01",
  "fecha_fin": "2026-12-31",
  "created_at": "2026-05-01T21:46:43.000Z",
  "updated_at": "2026-05-01T21:46:43.000Z"
}
```

---

### 5. Obtener Casos por Cliente
```
GET /api/cases/client/{client_id}
Authorization: Bearer {token}
```

**URL Example:**
```
GET /api/cases/client/770e8400-e29b-41d4-a716-446655440002
```

**Success Response (200):**
```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "client_id": "770e8400-e29b-41d4-a716-446655440002",
    "tipo": "Demanda Civil",
    "estado": "abierto",
    "descripcion": "Demanda por incumplimiento de contrato de arrendamiento",
    "fecha_inicio": "2026-05-01",
    "fecha_fin": "2026-12-31",
    "created_at": "2026-05-01T21:46:43.000Z",
    "updated_at": "2026-05-01T21:46:43.000Z"
  }
]
```

---

### 6. Actualizar Caso
```
PUT /api/cases/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body (todos opcionales):**
```json
{
  "tipo": "Demanda Civil Modificada",
  "descripcion": "Descripción actualizada",
  "estado": "en_progreso"
}
```

**Success Response (200):**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "client_id": "770e8400-e29b-41d4-a716-446655440002",
  "tipo": "Demanda Civil Modificada",
  "estado": "en_progreso",
  "descripcion": "Descripción actualizada",
  "fecha_inicio": "2026-05-01",
  "fecha_fin": "2026-12-31",
  "created_at": "2026-05-01T21:46:43.000Z",
  "updated_at": "2026-05-01T22:20:00.000Z"
}
```

---

### 7. Cambiar Estado del Caso
```
PATCH /api/cases/{id}/status
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "estado": "cerrado"
}
```

**Success Response (200):**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "client_id": "770e8400-e29b-41d4-a716-446655440002",
  "tipo": "Demanda Civil",
  "estado": "cerrado",
  "descripcion": "Demanda por incumplimiento de contrato de arrendamiento",
  "fecha_inicio": "2026-05-01",
  "fecha_fin": "2026-12-31",
  "created_at": "2026-05-01T21:46:43.000Z",
  "updated_at": "2026-05-01T22:25:00.000Z"
}
```

---

### 8. Eliminar Caso
```
DELETE /api/cases/{id}
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "Case deleted successfully",
  "id": "880e8400-e29b-41d4-a716-446655440003"
}
```

---

## 🏥 Salud de la Aplicación

```
GET /api/health
```

**Success Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2026-05-01T21:46:43.000Z",
  "uptime": 3600
}
```

---

## 📊 Modelos de Datos (DTOs)

### Usuario
```typescript
{
  id: UUID;
  email: string;           // unique
  password: string;        // hashed (bcrypt)
  role: 'admin' | 'lawyer' | 'user';
  created_at: Date;
  updated_at: Date;
}
```

### Cliente
```typescript
{
  id: UUID;
  rut: string;             // unique, formato: XX.XXX.XXX-X
  nombre: string;
  telefono: string;        // formato: +569XXXXXXXX
  email: string;           // unique
  created_at: Date;
  updated_at: Date;
}
```

### Caso
```typescript
{
  id: UUID;
  client_id: UUID;         // FK -> Clients
  tipo: string;            // ej: "Demanda Civil", "Apelación", etc.
  estado: 'abierto' | 'en_progreso' | 'cerrado' | 'pausado';
  descripcion: string;
  fecha_inicio: Date;
  fecha_fin?: Date;        // optional
  created_at: Date;
  updated_at: Date;
}
```

---

## ⚠️ Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| **200** | OK - Solicitud exitosa |
| **201** | Created - Recurso creado exitosamente |
| **400** | Bad Request - Datos inválidos |
| **401** | Unauthorized - Token inválido o faltante |
| **403** | Forbidden - Sin permiso |
| **404** | Not Found - Recurso no encontrado |
| **409** | Conflict - Recurso duplicado (email, RUT) |
| **500** | Internal Server Error - Error del servidor |

---

## 🔄 Flujo de Trabajo Típico (Frontend)

```javascript
// 1. Login
const loginRes = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'admin@example.com', 
    password: 'password123' 
  })
});
const { access_token } = await loginRes.json();
localStorage.setItem('token', access_token);

// 2. Listar Clientes
const clientsRes = await fetch('http://localhost:3000/api/clients', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
const clients = await clientsRes.json();

// 3. Crear Caso para Cliente
const caseRes = await fetch('http://localhost:3000/api/cases', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    client_id: clients[0].id,
    tipo: 'Demanda Civil',
    estado: 'abierto',
    descripcion: 'Demanda por...',
    fecha_inicio: '2026-05-01'
  })
});
const newCase = await caseRes.json();

// 4. Obtener Estadísticas
const statsRes = await fetch('http://localhost:3000/api/cases/stats', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
const stats = await statsRes.json();
```

---

## 📚 Stack Tecnológico Backend

- **Framework**: NestJS 10.2.10
- **ORM**: TypeORM 0.3.x (PostgreSQL)
- **Autenticación**: JWT + Passport.js
- **Hashing**: bcrypt
- **Documentación**: Swagger/OpenAPI
- **Node.js**: 18+

---

## 📝 Notas Importantes

1. **Token expira**: Configurado a 24 horas
2. **Validación**: Todos los DTOs validados con class-validator
3. **Timestamps**: Todos los registros tienen created_at y updated_at
4. **UUID**: Todos los IDs son UUID v4
5. **Soft Delete**: Los usuarios pueden marcarse como eliminados sin borrar datos
6. **Relaciones**: Un Cliente puede tener múltiples Casos
7. **CORS**: Configurado para localhost:3000 (ajustar en producción)

---

## 🚀 Próximos Pasos

1. Crear proyecto frontend (React/Vue/Angular)
2. Implementar servicio API que consume estos endpoints
3. Crear formularios de login, CRUD de clientes y casos
4. Implementar dashboards con estadísticas
5. Agregar validación de formularios del lado del cliente

¡Listo para desarrollar el frontend! 🎉
