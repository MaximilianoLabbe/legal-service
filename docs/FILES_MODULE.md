# Almacenamiento de Archivos en Casos

Este módulo permite que cada caso almacene archivos de diferentes tipos.

## Características

- ✅ Subida de múltiples tipos de archivo (PDF, imágenes, documentos Word, Excel, etc.)
- ✅ Validación de tipo y tamaño de archivo (máximo 50MB)
- ✅ Categorización y descripción de archivos
- ✅ Descarga segura de archivos
- ✅ Eliminación de archivos con limpieza del sistema de archivos
- ✅ Estadísticas de archivos por caso
- ✅ Relación automática con casos (eliminación en cascada)

## Tipos de archivo permitidos

- Imágenes: PNG, JPEG, GIF
- Documentos: PDF, Word (.doc, .docx), Excel (.xls, .xlsx)
- Texto: TXT, ZIP (comprimidos)
- Tamaño máximo: 50MB por archivo

## Endpoints

### Subir archivo
```
POST /archivos/:caseId/subir
Content-Type: multipart/form-data

Body:
- file: archivo (requerido)
- categoría: string (opcional)
- descripcion: string (opcional)
```

### Obtener archivos de un caso
```
GET /archivos/caso/:caseId
```

### Obtener estadísticas de archivos
```
GET /archivos/caso/:caseId/estadísticas
```

### Obtener detalles de archivo
```
GET /archivos/:fileId
```

### Descargar archivo
```
GET /archivos/:fileId/descargar
```

### Actualizar metadata
```
PATCH /archivos/:fileId
Body: { categoría?, descripcion? }
```

### Eliminar archivo
```
DELETE /archivos/:fileId
```

## Estructura de carpetas

```
uploads/          # Directorio donde se almacenan los archivos (creado automáticamente)
src/files/
  ├── entities/   # Entidad File
  ├── dto/        # DTOs para crear/actualizar archivos
  ├── files.service.ts
  ├── files.controller.ts
  └── files.module.ts
```

## Variables de entorno (opcional)

```env
UPLOAD_PATH=./uploads          # Ruta donde se almacenan los archivos
MAX_FILE_SIZE=52428800         # Tamaño máximo en bytes (50MB)
```

## Notas

- Los archivos se almacenan en el servidor en la carpeta `uploads/`
- Se genera un nombre único (UUID) para cada archivo para evitar conflictos
- Al eliminar un archivo, se elimina tanto de la base de datos como del sistema de archivos
- Al eliminar un caso, todos sus archivos se eliminan automáticamente (ON DELETE CASCADE)
