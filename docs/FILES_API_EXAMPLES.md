# Ejemplos de uso - Módulo de Archivos

## 1. Subir un archivo a un caso

```bash
curl -X POST http://localhost:3000/archivos/{caseId}/subir \
  -H "Authorization: Bearer {token}" \
  -F "file=@documento.pdf" \
  -F "categoría=contrato" \
  -F "descripcion=Contrato del cliente"
```

**Respuesta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "case_id": "550e8400-e29b-41d4-a716-446655440001",
  "nombre_original": "documento.pdf",
  "nombre_almacenado": "550e8400-e29b-41d4-a716-446655440002.pdf",
  "tipo_archivo": "pdf",
  "mime_type": "application/pdf",
  "tamaño": 1024576,
  "ruta": "/uploads/550e8400-e29b-41d4-a716-446655440002.pdf",
  "categoría": "contrato",
  "descripcion": "Contrato del cliente",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## 2. Obtener todos los archivos de un caso

```bash
curl -X GET http://localhost:3000/archivos/caso/{caseId} \
  -H "Authorization: Bearer {token}"
```

**Respuesta:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "case_id": "550e8400-e29b-41d4-a716-446655440001",
    "nombre_original": "documento.pdf",
    "tipo_archivo": "pdf",
    "tamaño": 1024576,
    "categoría": "contrato",
    "created_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "case_id": "550e8400-e29b-41d4-a716-446655440001",
    "nombre_original": "imagen.jpg",
    "tipo_archivo": "imagen",
    "tamaño": 2048576,
    "categoría": "evidencia",
    "created_at": "2024-01-15T11:00:00Z"
  }
]
```

## 3. Obtener estadísticas de archivos de un caso

```bash
curl -X GET http://localhost:3000/archivos/caso/{caseId}/estadísticas \
  -H "Authorization: Bearer {token}"
```

**Respuesta:**
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

## 4. Obtener detalles de un archivo específico

```bash
curl -X GET http://localhost:3000/archivos/{fileId} \
  -H "Authorization: Bearer {token}"
```

**Respuesta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "case_id": "550e8400-e29b-41d4-a716-446655440001",
  "nombre_original": "documento.pdf",
  "tipo_archivo": "pdf",
  "mime_type": "application/pdf",
  "tamaño": 1024576,
  "categoría": "contrato",
  "descripcion": "Contrato del cliente",
  "created_at": "2024-01-15T10:30:00Z"
}
```

## 5. Descargar un archivo

```bash
curl -X GET http://localhost:3000/archivos/{fileId}/descargar \
  -H "Authorization: Bearer {token}" \
  -o documento.pdf
```

## 6. Actualizar metadata de un archivo

```bash
curl -X PATCH http://localhost:3000/archivos/{fileId} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "categoría": "contrato_firmado",
    "descripcion": "Contrato actualizado el 15/01/2024"
  }'
```

**Respuesta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "case_id": "550e8400-e29b-41d4-a716-446655440001",
  "nombre_original": "documento.pdf",
  "categoría": "contrato_firmado",
  "descripcion": "Contrato actualizado el 15/01/2024",
  "updated_at": "2024-01-15T12:00:00Z"
}
```

## 7. Eliminar un archivo

```bash
curl -X DELETE http://localhost:3000/archivos/{fileId} \
  -H "Authorization: Bearer {token}"
```

**Respuesta:**
```json
{
  "message": "Archivo eliminado exitosamente"
}
```

## Uso con JavaScript/TypeScript

```typescript
// Subir archivo
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('categoría', 'contrato');
formData.append('descripcion', 'Mi contrato');

const response = await fetch(`/archivos/${caseId}/subir`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const file = await response.json();

// Obtener archivos
const filesResponse = await fetch(`/archivos/caso/${caseId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const files = await filesResponse.json();

// Descargar archivo
const downloadUrl = `/archivos/${fileId}/descargar`;
window.location.href = downloadUrl;
```

## Validaciones

- **Tamaño máximo:** 50MB
- **Tipos permitidos:**
  - Imágenes: PNG, JPEG, GIF
  - Documentos: PDF, Word (.doc, .docx), Excel (.xls, .xlsx)
  - Otros: TXT, ZIP

## Códigos de error

- `400 Bad Request`: Archivo no permitido o tamaño excedido
- `404 Not Found`: Archivo o caso no encontrado
- `401 Unauthorized`: Token inválido o expirado
- `500 Internal Server Error`: Error en el servidor
