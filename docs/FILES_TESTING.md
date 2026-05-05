# Guía de Pruebas - Módulo de Archivos

## Requisitos Previos

1. Base de datos PostgreSQL ejecutando
2. Aplicación NestJS iniciada en http://localhost:3000
3. Token JWT válido del usuario autenticado
4. Herramienta para hacer requests (Postman, curl, Thunder Client, etc.)

## 1. Obtener Token JWT

**Endpoint**: `POST /auth/login`

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Respuesta esperada**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Guardar el token para usarlo en los siguientes requests.

## 2. Obtener ID de Caso

Necesitarás un caso existente. Obtén la lista de casos:

```bash
curl -X GET http://localhost:3000/casos \
  -H "Authorization: Bearer {token}"
```

O crea un caso nuevo si es necesario. Guarda el `id` del caso.

## 3. Pruebas de Funcionalidad

### Test 1: Subir Archivo (PDF)

```bash
curl -X POST http://localhost:3000/archivos/{caseId}/subir \
  -H "Authorization: Bearer {token}" \
  -F "file=@documento.pdf" \
  -F "categoría=contrato" \
  -F "descripcion=Contrato original del cliente"
```

**Validar**:
- ✓ Status code: 201 Created
- ✓ Response contiene: id, nombre_original, tipo_archivo, tamaño
- ✓ Archivo existe en `uploads/` en el servidor

**Response esperado**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "case_id": "{caseId}",
  "nombre_original": "documento.pdf",
  "nombre_almacenado": "550e8400-e29b-41d4-a716-446655440001.pdf",
  "tipo_archivo": "pdf",
  "mime_type": "application/pdf",
  "tamaño": 1024576,
  "ruta": "/uploads/550e8400-e29b-41d4-a716-446655440001.pdf",
  "categoría": "contrato",
  "descripcion": "Contrato original del cliente",
  "created_at": "2024-01-15T10:30:00Z"
}
```

Guardar el `id` del archivo para pruebas posteriores.

### Test 2: Subir Imagen

```bash
curl -X POST http://localhost:3000/archivos/{caseId}/subir \
  -H "Authorization: Bearer {token}" \
  -F "file=@evidencia.jpg" \
  -F "categoría=evidencia" \
  -F "descripcion=Foto del incidente"
```

**Validar**:
- ✓ tipo_archivo es "imagen"
- ✓ mime_type es "image/jpeg"

### Test 3: Subir Documento Word

```bash
curl -X POST http://localhost:3000/archivos/{caseId}/subir \
  -H "Authorization: Bearer {token}" \
  -F "file=@informe.docx" \
  -F "categoría=informe"
```

**Validar**:
- ✓ tipo_archivo es "documento"
- ✓ mime_type es "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

### Test 4: Validación - Archivo No Permitido

```bash
curl -X POST http://localhost:3000/archivos/{caseId}/subir \
  -H "Authorization: Bearer {token}" \
  -F "file=@script.exe"
```

**Validar**:
- ✓ Status code: 400 Bad Request
- ✓ Message: "Tipo de archivo no permitido"

### Test 5: Validación - Archivo Muy Grande

```bash
# Crear archivo >50MB (ejemplo)
dd if=/dev/zero of=bigfile.bin bs=1M count=51

curl -X POST http://localhost:3000/archivos/{caseId}/subir \
  -H "Authorization: Bearer {token}" \
  -F "file=@bigfile.bin"
```

**Validar**:
- ✓ Status code: 400 Bad Request
- ✓ Message: "archivo es demasiado grande"

### Test 6: Listar Archivos del Caso

```bash
curl -X GET http://localhost:3000/archivos/caso/{caseId} \
  -H "Authorization: Bearer {token}"
```

**Validar**:
- ✓ Retorna array de archivos
- ✓ Ordena por created_at DESC
- ✓ Incluye todos los archivos subidos

**Response esperado**:
```json
[
  {
    "id": "...",
    "case_id": "{caseId}",
    "nombre_original": "evidencia.jpg",
    "tipo_archivo": "imagen",
    "tamaño": 2048576,
    "created_at": "2024-01-15T11:00:00Z"
  },
  {
    "id": "...",
    "case_id": "{caseId}",
    "nombre_original": "documento.pdf",
    "tipo_archivo": "pdf",
    "tamaño": 1024576,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### Test 7: Obtener Estadísticas

```bash
curl -X GET http://localhost:3000/archivos/caso/{caseId}/estadísticas \
  -H "Authorization: Bearer {token}"
```

**Validar**:
- ✓ total_archivos es correcto
- ✓ tamaño_total es suma de todos los archivos
- ✓ por_tipo muestra conteo por tipo

**Response esperado**:
```json
{
  "total_archivos": 2,
  "tamaño_total": 3073152,
  "por_tipo": {
    "pdf": 1,
    "imagen": 1
  },
  "archivos": [...]
}
```

### Test 8: Obtener Detalles de Archivo

```bash
curl -X GET http://localhost:3000/archivos/{fileId} \
  -H "Authorization: Bearer {token}"
```

**Validar**:
- ✓ Retorna objeto del archivo específico
- ✓ Incluye toda la metadata

### Test 9: Descargar Archivo

```bash
curl -X GET http://localhost:3000/archivos/{fileId}/descargar \
  -H "Authorization: Bearer {token}" \
  -o archivo_descargado.pdf
```

**Validar**:
- ✓ Status code: 200 OK
- ✓ Header Content-Disposition incluye nombre_original
- ✓ Archivo descargado es idéntico al original

### Test 10: Actualizar Metadata

```bash
curl -X PATCH http://localhost:3000/archivos/{fileId} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "categoría": "contrato_firmado",
    "descripcion": "Contrato actualizado y firmado por ambas partes"
  }'
```

**Validar**:
- ✓ Status code: 200 OK
- ✓ Campos actualizados correctamente
- ✓ updated_at cambió

**Response esperado**:
```json
{
  "id": "...",
  "categoría": "contrato_firmado",
  "descripcion": "Contrato actualizado y firmado por ambas partes",
  "updated_at": "2024-01-15T12:00:00Z"
}
```

### Test 11: Eliminar Archivo

```bash
curl -X DELETE http://localhost:3000/archivos/{fileId} \
  -H "Authorization: Bearer {token}"
```

**Validar**:
- ✓ Status code: 200 OK
- ✓ Message: "Archivo eliminado exitosamente"
- ✓ Archivo no existe en BD después
- ✓ Archivo no existe en disco después

### Test 12: Eliminar Caso (Cascada)

1. Subir archivos a un caso
2. Eliminar el caso

```bash
curl -X DELETE http://localhost:3000/casos/{caseId} \
  -H "Authorization: Bearer {token}"
```

**Validar**:
- ✓ Caso eliminado
- ✓ Todos los archivos del caso eliminados de BD
- ✓ Todos los archivos eliminados del disco

## Pruebas de Autenticación

### Test 13: Sin Token

```bash
curl -X GET http://localhost:3000/archivos/caso/{caseId}
# Sin header Authorization
```

**Validar**:
- ✓ Status code: 401 Unauthorized

### Test 14: Token Inválido

```bash
curl -X GET http://localhost:3000/archivos/caso/{caseId} \
  -H "Authorization: Bearer token_invalido"
```

**Validar**:
- ✓ Status code: 401 Unauthorized

## Pruebas de Validación

### Test 15: Case ID Inválido

```bash
curl -X POST http://localhost:3000/archivos/not-a-uuid/subir \
  -H "Authorization: Bearer {token}" \
  -F "file=@documento.pdf"
```

**Validar**:
- ✓ Status code: 400 Bad Request
- ✓ Error de validación UUID

### Test 16: File ID No Existe

```bash
curl -X GET http://localhost:3000/archivos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer {token}"
```

**Validar**:
- ✓ Status code: 404 Not Found
- ✓ Message: "Archivo con ID ... no encontrado"

## Pruebas de Base de Datos

### Test 17: Verificar Tabla

```bash
psql -U postgres legal_management -c "SELECT * FROM files LIMIT 5;"
```

**Validar**:
- ✓ Tabla `files` existe
- ✓ Columnas correctas
- ✓ Registros se crean correctamente

### Test 18: Verificar Relación

```bash
psql -U postgres legal_management -c "
  SELECT f.id, f.nombre_original, c.id as case_id 
  FROM files f 
  JOIN cases c ON f.case_id = c.id 
  LIMIT 5;
"
```

**Validar**:
- ✓ Relación correcta entre files y cases
- ✓ case_id no es null
- ✓ Referencia a caso válido

### Test 19: Verificar Índices

```bash
psql -U postgres legal_management -c "
  SELECT tablename, indexname 
  FROM pg_indexes 
  WHERE tablename = 'files';
"
```

**Validar**:
- ✓ idx_files_case_id existe
- ✓ idx_files_tipo_archivo existe
- ✓ idx_files_created_at existe

## Casos de Uso Completos

### Escenario 1: Caso Completo de Litigio

1. Crear caso
2. Subir contrato (PDF)
3. Subir evidencia (Imágenes)
4. Subir informe legal (Word)
5. Ver estadísticas
6. Actualizar descripciones
7. Descargar archivos
8. Preparar para tribunal

### Escenario 2: Auditoría

1. Verificar total de archivos
2. Verificar tamaño total
3. Verificar tipos de archivo
4. Verificar timestamps
5. Verificar usuario (propietario del caso)

## Herramientas Recomendadas

- **Postman**: Cliente REST con UI
- **Insomnia**: Similar a Postman
- **Thunder Client**: Extensión de VS Code
- **curl**: CLI para testing
- **DBeaver**: Gestión de PostgreSQL

## Checklist de Validación

- [ ] Tabla `files` creada en BD
- [ ] Módulo FilesModule importado en app.module.ts
- [ ] Carpeta `uploads/` creada automáticamente
- [ ] Subida de archivos funciona
- [ ] Descarga de archivos funciona
- [ ] Eliminación de archivos funciona (BD y disco)
- [ ] Eliminación de caso elimina archivos (CASCADE)
- [ ] Validación de tipos funciona
- [ ] Validación de tamaño funciona
- [ ] Autenticación JWT requiere token
- [ ] Estadísticas son correctas
- [ ] Metadata se actualiza correctamente
