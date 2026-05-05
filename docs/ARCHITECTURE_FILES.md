# Arquitectura - Módulo de Archivos

## Diagrama de Relaciones de Entidades

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USUARIOS                                   │
│                      (users.entity.ts)                              │
│                                                                       │
│  - id (UUID)                                                        │
│  - email (VARCHAR UNIQUE)                                           │
│  - password (VARCHAR)                                               │
│  - first_name, last_name (VARCHAR)                                  │
│  - role (ENUM: admin, lawyer, user)                                 │
└─────────────────────────────────────────────────────────────────────┘
         ↓ (1:N) create/own
         ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENTES                                    │
│                    (client.entity.ts)                               │
│                                                                       │
│  - id (UUID)                                                        │
│  - user_id (FK → users)                                             │
│  - rut, nombre, email, telefono                                     │
└─────────────────────────────────────────────────────────────────────┘
         ↓ (1:N) related
         ↓
┌─────────────────────────────────────────────────────────────────────┐
│                          CASOS                                      │
│                     (case.entity.ts)                                │
│                                                                       │
│  - id (UUID)                                                        │
│  - client_id (FK → clients)                                         │
│  - user_id (FK → users)                                             │
│  - tipo, estado, descripcion                                        │
│  - fecha_inicio, fecha_fin                                          │
│                                                                       │
│  ◆ Relación: 1 Caso → N Archivos                                    │
└─────────────────────────────────────────────────────────────────────┘
         ↓ (1:N) contains [NEW]
         ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         ARCHIVOS                                    │
│                    (file.entity.ts) [NEW]                           │
│                                                                       │
│  - id (UUID)                                                        │
│  - case_id (FK → cases) [CASCADE]                                   │
│  - nombre_original (VARCHAR)                                        │
│  - nombre_almacenado (VARCHAR UNIQUE)                               │
│  - tipo_archivo (VARCHAR: pdf, imagen, documento, etc.)            │
│  - mime_type (VARCHAR: application/pdf, image/jpeg, etc.)          │
│  - tamaño (BIGINT: bytes)                                           │
│  - ruta (TEXT: /uploads/uuid.ext)                                   │
│  - categoría (VARCHAR, nullable)                                    │
│  - descripcion (TEXT, nullable)                                     │
│  - created_at, updated_at (TIMESTAMP)                               │
└─────────────────────────────────────────────────────────────────────┘
         ↓ (stored on disk)
         ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    SISTEMA DE ARCHIVOS                              │
│                                                                       │
│  uploads/                                                           │
│  ├── 550e8400-e29b-41d4-a716-446655440000.pdf                      │
│  ├── 550e8400-e29b-41d4-a716-446655440001.jpg                      │
│  ├── 550e8400-e29b-41d4-a716-446655440002.docx                     │
│  └── ...                                                            │
└─────────────────────────────────────────────────────────────────────┘
```

## Flujo de Subida de Archivo

```
┌─────────────────────────────────────────────────┐
│ 1. Usuario envía POST /archivos/{caseId}/subir  │
│    - Header: Authorization: Bearer {token}      │
│    - Body: multipart/form-data                  │
│      * file: archivo                            │
│      * categoría: string (opcional)             │
│      * descripcion: string (opcional)           │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ 2. FilesController.uploadFile()                 │
│    - Valida token JWT                           │
│    - Verifica que caseId sea UUID válido        │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ 3. FilesService.uploadFile()                    │
│    - Verifica que el caso existe                │
│    - Valida tipo MIME                           │
│    - Valida tamaño (<50MB)                      │
│    - Genera UUID único para archivo             │
│    - Guarda en disco: uploads/{uuid}.ext        │
│    - Crea registro en BD (files table)          │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ 4. Response: 201 Created                        │
│    {                                            │
│      id, case_id, nombre_original,              │
│      tipo_archivo, tamaño, ruta, ...            │
│    }                                            │
└─────────────────────────────────────────────────┘
```

## Flujo de Descarga de Archivo

```
┌──────────────────────────────────────────────────┐
│ 1. Usuario envía GET /archivos/{fileId}/descargar│
│    - Header: Authorization: Bearer {token}       │
└────────────────┬─────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────────┐
│ 2. FilesController.downloadFile()                │
│    - Valida token JWT                            │
│    - Verifica que fileId sea UUID válido         │
└────────────────┬─────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────────┐
│ 3. FilesService.downloadFile()                   │
│    - Busca archivo en BD                         │
│    - Verifica que existe en disco                │
│    - Retorna filepath y nombre_original          │
└────────────────┬─────────────────────────────────┘
                 ↓
┌──────────────────────────────────────────────────┐
│ 4. Express res.download()                        │
│    - Envía archivo al cliente                    │
│    - Headers: Content-Disposition, etc.          │
│    - Nombre descargado: nombre_original          │
└──────────────────────────────────────────────────┘
```

## Tipos de Archivo Permitidos

```
┌────────────────────────────────────────────────────┐
│  CATEGORÍA    │  TIPOS                             │
├────────────────────────────────────────────────────┤
│  Imágenes     │  PNG, JPEG, GIF                    │
│  Documentos   │  PDF, Word (.doc, .docx)           │
│  Hojas Cálculo│  Excel (.xls, .xlsx)               │
│  Texto        │  TXT                               │
│  Comprimidos  │  ZIP                               │
│                                                    │
│  Validaciones:                                     │
│  - Tamaño máximo: 50 MB                           │
│  - MIME type obligatorio                          │
│  - Extensión validada                             │
└────────────────────────────────────────────────────┘
```

## Estructura de Directorios

```
backend-ls/
├── src/
│   ├── files/                              [NEW MODULE]
│   │   ├── entities/
│   │   │   └── file.entity.ts             [NEW]
│   │   ├── dto/
│   │   │   ├── create-file.dto.ts         [NEW]
│   │   │   └── update-file.dto.ts         [NEW]
│   │   ├── files.service.ts               [NEW]
│   │   ├── files.controller.ts            [NEW]
│   │   └── files.module.ts                [NEW]
│   ├── cases/
│   │   └── entities/
│   │       └── case.entity.ts             [UPDATED - Relación File]
│   └── app.module.ts                      [UPDATED - Import FilesModule]
├── uploads/                               [NEW DIR - Auto-created]
├── scripts/
│   └── 04-create-files-table.sql          [NEW]
├── docs/
│   ├── FILES_MODULE.md                    [NEW]
│   ├── FILES_API_EXAMPLES.md              [NEW]
│   ├── FILES_INTEGRATION.md               [NEW]
│   └── ARCHITECTURE.md                    [NEW - Este archivo]
├── DATABASE_SETUP.sql                     [UPDATED - tabla files]
└── CHANGELOG.md                           [UPDATED - v1.1.0]
```

## Componentes del Módulo

### 1. Entidad (ORM)
```typescript
@Entity('files')
export class File {
  // Almacena metadata de archivos en BD
  // Relación bidireccional con Case
}
```

### 2. DTOs (Validación)
```typescript
// Para crear archivos (categoría, descripcion opcionales)
export class CreateFileDto { }

// Para actualizar metadata (categoría, descripcion opcionales)
export class UpdateFileDto { }
```

### 3. Servicio (Lógica)
```typescript
export class FilesService {
  uploadFile()          // Subir y guardar archivo
  getFilesByCase()      // Listar archivos de caso
  getFileById()         // Obtener detalles
  downloadFile()        // Preparar para descarga
  updateFile()          // Actualizar metadata
  deleteFile()          // Eliminar
  getFileStats()        // Estadísticas
}
```

### 4. Controlador (API)
```typescript
export class FilesController {
  @Post(':caseId/subir')                    // Subir
  @Get('caso/:caseId')                      // Listar
  @Get('caso/:caseId/estadísticas')         // Estadísticas
  @Get(':fileId')                           // Detalles
  @Get(':fileId/descargar')                 // Descargar
  @Patch(':fileId')                         // Actualizar
  @Delete(':fileId')                        // Eliminar
}
```

### 5. Módulo (Integración)
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([File]), CasesModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule { }
```

## Seguridad

✅ **Autenticación**: JWT requerido en todos los endpoints
✅ **Autorización**: Guards protegen acceso
✅ **Validación**: Tipos y tamaños validados
✅ **Nombres únicos**: UUID evita conflictos
✅ **Eliminación segura**: Limpieza de disco
✅ **SQL Injection**: TypeORM previene inyecciones
✅ **Path Traversal**: Rutas sanitizadas

## Rendimiento

🚀 **Índices en BD**:
- idx_files_case_id - Búsquedas rápidas por caso
- idx_files_tipo_archivo - Filtrado por tipo
- idx_files_created_at - Ordenamiento temporal

🚀 **Almacenamiento**:
- Archivos en disco separados
- Metadata en BD para queries rápidas
- Eliminación en cascada automática

## Escalabilidad Futura

Para crecer el sistema:
1. **Cloud Storage**: Migrar uploads a S3/Azure
2. **CDN**: Cache de descargas frecuentes
3. **Virus Scan**: Integrar antivirus
4. **Compresión**: Automática para imágenes
5. **Versionado**: Historial de cambios
6. **OCR**: Búsqueda en documentos
