# Guía de Integración - Módulo de Archivos

## Resumen

Se ha implementado un módulo completo de almacenamiento de archivos que permite que cada caso legal almacene archivos de distintos tipos (PDFs, imágenes, documentos Office, etc.).

## Archivos Creados

### Módulo Files
```
src/files/
├── entities/
│   └── file.entity.ts              # Entidad TypeORM para archivos
├── dto/
│   ├── create-file.dto.ts         # DTO para crear archivos
│   └── update-file.dto.ts         # DTO para actualizar metadata
├── files.service.ts               # Servicio con lógica de negocios
├── files.controller.ts            # Controlador con endpoints
└── files.module.ts                # Módulo NestJS
```

### Documentación
- `docs/FILES_MODULE.md` - Documentación técnica del módulo
- `docs/FILES_API_EXAMPLES.md` - Ejemplos de uso de la API
- `scripts/04-create-files-table.sql` - Script SQL para crear tabla

### Directorio de Uploads
```
uploads/                            # Se crea automáticamente al iniciar
└── [archivos con UUID]
```

## Cambios en Archivos Existentes

### 1. Entidad Case [src/cases/entities/case.entity.ts]
- ✅ Agregada relación OneToMany con File
- ✅ Importado File entity

### 2. App Module [src/app.module.ts]
- ✅ Importado FilesModule

### 3. Database Setup [DATABASE_SETUP.sql]
- ✅ Agregada tabla `files` en sección 4
- ✅ Agregados índices para tabla `files` en sección 5

### 4. Changelog [CHANGELOG.md]
- ✅ Actualizado con versión 1.1.0

## Configuración Base de Datos

### PostgreSQL

La tabla `files` se crea automáticamente al ejecutar:

```sql
-- Ejecutar el script completo DATABASE_SETUP.sql
-- O ejecutar solo la tabla files:

CREATE TABLE IF NOT EXISTS files (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL,
  nombre_original VARCHAR(255) NOT NULL,
  nombre_almacenado VARCHAR(255) NOT NULL UNIQUE,
  tipo_archivo VARCHAR(100) NOT NULL,
  mime_type VARCHAR(50) NOT NULL,
  tamaño BIGINT NOT NULL,
  ruta TEXT NOT NULL,
  categoría VARCHAR(100),
  descripcion TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT pk_files PRIMARY KEY (id),
  CONSTRAINT fk_files_case_id FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);
```

## Configuración de la Aplicación

### 1. Asegurar que TypeORM importa la entidad File

En `src/database/typeorm.config.ts`, verificar que File está en entities:

```typescript
entities: [
  User,
  Client,
  Case,
  File  // ← Agregar esta línea
],
```

### 2. Verificar directorios

El directorio `uploads/` se crea automáticamente en el inicio de la aplicación.

## Endpoints de la API

### Autenticación
Todos los endpoints requieren JWT token en el header:
```
Authorization: Bearer {token}
```

### Subir archivo
```
POST /archivos/:caseId/subir
Content-Type: multipart/form-data

Body:
- file: archivo (requerido)
- categoría: string (opcional)
- descripcion: string (opcional)
```

### Obtener archivos
```
GET /archivos/caso/:caseId
```

### Estadísticas
```
GET /archivos/caso/:caseId/estadísticas
```

### Obtener detalles
```
GET /archivos/:fileId
```

### Descargar
```
GET /archivos/:fileId/descargar
```

### Actualizar
```
PATCH /archivos/:fileId
Body: { categoría?, descripcion? }
```

### Eliminar
```
DELETE /archivos/:fileId
```

## Validaciones Implementadas

✅ **Tipo de archivo:** 
- Imágenes: PNG, JPEG, GIF
- Documentos: PDF, Word, Excel
- Otros: TXT, ZIP

✅ **Tamaño máximo:** 50MB

✅ **Verificación de caso:** El caso debe existir antes de subir un archivo

✅ **Seguridad:** 
- Nombres únicos con UUID
- Sanitización de rutas
- Protección por JWT

## Funcionalidades Principales

### 1. Subida de Archivos
- Validación de tipo y tamaño
- Almacenamiento con nombre único
- Metadata automática (MIME type, tamaño)

### 2. Gestión de Metadata
- Categorización de archivos
- Descripción personalizada
- Timestamps de creación/actualización

### 3. Estadísticas
- Total de archivos por caso
- Tamaño total almacenado
- Conteo por tipo de archivo

### 4. Descarga Segura
- Verificación de existencia de archivo
- Manejo correcto de headers
- Nombres de archivo originales preservados

### 5. Eliminación
- Eliminación de base de datos
- Eliminación del sistema de archivos
- Limpieza automática al eliminar caso (CASCADE)

## Pasos de Implementación

### 1. Crear tabla en BD
```bash
# Opción 1: Ejecutar todo DATABASE_SETUP.sql
psql -U postgres legal_management < DATABASE_SETUP.sql

# Opción 2: Ejecutar solo tabla files
psql -U postgres legal_management < scripts/04-create-files-table.sql
```

### 2. Actualizar entidades de TypeORM
```typescript
// En src/database/typeorm.config.ts
import { File } from '../files/entities/file.entity';

entities: [..., File]
```

### 3. Iniciar aplicación
```bash
npm run start:dev
```

### 4. Probar endpoints
Ver `docs/FILES_API_EXAMPLES.md` para ejemplos completos.

## Notas Importantes

- 📁 El directorio `uploads/` se crea automáticamente
- 🔐 Todos los archivos se almacenan con UUID único para evitar conflictos
- 🗑️ Al eliminar un caso, todos sus archivos se eliminan automáticamente
- 📊 Se pueden filtrar archivos por tipo_archivo
- 🛡️ La subida requiere autenticación JWT

## Próximas Mejoras

- [ ] Soporte para cloud storage (S3, Azure Blob)
- [ ] Compresión automática de imágenes
- [ ] Escaneo de virus
- [ ] Versionado de archivos
- [ ] Compartir archivos entre usuarios
- [ ] Firmado digital de documentos
- [ ] OCR de documentos
