# Cambios y Actualizaciones

Historial de cambios y versiones del proyecto.

## [1.1.0] - 2024-05-03 (Actual)

### Agregado
- ✅ Módulo de Almacenamiento de Archivos (Files)
- ✅ Entidad File con relación One-to-Many a Cases
- ✅ Endpoints para subida, descarga y gestión de archivos
- ✅ Validación de tipos y tamaño de archivo (máximo 50MB)
- ✅ Categorización y descripción de archivos
- ✅ Estadísticas de archivos por caso
- ✅ Eliminación en cascada de archivos al eliminar caso
- ✅ Documentación del módulo de archivos (FILES_MODULE.md)
- ✅ Ejemplos de uso de la API de archivos (FILES_API_EXAMPLES.md)
- ✅ Script SQL para crear tabla files (04-create-files-table.sql)
- ✅ Directorio de uploads automático

### Características
- Subida de múltiples tipos de archivo
- Almacenamiento seguro con nombres únicos (UUID)
- Tipos permitidos: PDF, imágenes, documentos Office, TXT, ZIP
- Gestión de metadatos de archivos
- Descarga segura de archivos
- Estadísticas por tipo de archivo

### Cambios en Entidades
- `Case`: Agregada relación OneToMany con File
- `File` (Nueva): Entidad para almacenar archivos

## [1.0.0] - 2024-05-01

### Agregado
- ✅ Estructura base de NestJS con arquitectura modular
- ✅ Módulo de Autenticación (JWT + Passport)
- ✅ Módulo de Usuarios
- ✅ Módulo de Clientes
- ✅ Módulo de Casos Legales
- ✅ Sistema de Guards y Decoradores
- ✅ Interceptores de logging y transformación
- ✅ Filtros de excepción HTTP
- ✅ DTOs y Validaciones
- ✅ Capa de acceso a datos abstracción
- ✅ Soporte para SQL Server y Oracle DB
- ✅ Documentación completa (DATABASE_SETUP, API_EXAMPLES, DEVELOPMENT_GUIDE)
- ✅ Scripts SQL para crear tablas
- ✅ Scripts de datos de prueba
- ✅ Configuración de Docker y docker-compose
- ✅ Guía de Deployment
- ✅ Guía de Seguridad
- ✅ Características Avanzadas documentadas

### Características Principales
- Autenticación JWT con expiración configurable
- Contraseñas encriptadas con bcrypt
- CRUD completo para clientes y casos
- Protección de endpoints con Guards
- Validación automática de entrada
- Manejo de errores robusto
- Logging de eventos
- Estadísticas de casos
- Cambio de estado de casos

### Próximas Versiones
- [ ] Notificaciones por email
- [ ] Reportes avanzados
- [ ] Integración con WhatsApp/SMS
- [ ] Panel de administración
- [ ] Cache con Redis
- [ ] Auditoría completa
- [ ] GraphQL
- [ ] Microservicios
- [ ] Compartir archivos entre usuarios
- [ ] Historial de versiones de archivos

---

## Contribuciones

Para contribuir:
1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más detalles.

## Contacto

Para preguntas o soporte: contact@example.com
