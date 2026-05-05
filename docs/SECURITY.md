# Guía de Seguridad

Mejores prácticas de seguridad para el backend.

## 1. Autenticación y Autorización

### JWT (JSON Web Tokens)

✅ **Implementado**
- Tokens con expiración
- Estrategia Passport JWT
- Guards para proteger endpoints

⚠️ **Mejoras Recomendadas**
```typescript
// Implementar refresh tokens
@Post('refresh')
async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
  const newAccessToken = await this.authService.refreshToken(refreshToken);
  return { accessToken: newAccessToken };
}

// Implementar blacklist de tokens para logout
@Post('logout')
@UseGuards(JwtAuthGuard)
async logout(@CurrentUser() user) {
  await this.authService.blacklistToken(user.id);
}
```

### Contraseñas

✅ **Implementado**
- Hash con bcrypt (10 rounds)
- Validación de contraseña mínimo 6 caracteres

⚠️ **Mejoras Recomendadas**
```env
# Aumentar requisitos en producción
PASSWORD_MIN_LENGTH=12
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_NUMBERS=true
PASSWORD_REQUIRE_SPECIAL=true
```

### Roles y Permisos

✅ **Implementado**
- Guards basados en roles
- Decoradores de roles

⚠️ **Mejoras Recomendadas**
- Implementar control granular por recurso
- Auditoría de accesos

## 2. Validación de Datos

✅ **Implementado**
- DTOs con validación automática
- class-validator integrado
- Validación en entrada

⚠️ **Mejoras Recomendadas**
```typescript
// Sanitizar entrada
import { sanitize } from 'class-sanitizer';

export class CreateUserDto {
  @IsEmail()
  @Trim()
  email: string;

  @IsString()
  @Length(8, 128)
  password: string;
}
```

## 3. Protección contra Ataques Comunes

### SQL Injection

✅ **Protegido**
- Queries parametrizadas
- No concatenar strings en SQL

### XSS (Cross-Site Scripting)

✅ **Protegido**
- CORS habilitado
- Validación de entrada

### CSRF (Cross-Site Request Forgery)

⚠️ **Recomendación**
```typescript
import { NestCsrf } from 'nest-csrf';

@Module({
  imports: [NestCsrf],
})
export class AppModule {}
```

### Rate Limiting

⚠️ **Implementar**
```bash
npm install @nestjs/throttler
```

```typescript
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100, // máximo 100 requests por minuto
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

### CORS

✅ **Implementado en main.ts**

```typescript
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});
```

## 4. Seguridad en Base de Datos

### Conexión Segura

✅ **Recomendaciones**
```env
# Usar variables de entorno para credenciales
DB_HOST=prod-db-server.azure.com
DB_PORT=1433
DB_USERNAME=dbuser
DB_PASSWORD=your_strong_password_here
DB_ENCRYPTED=true
```

### Mínimos Privilegios

✅ **Implementar**
```sql
-- Crear usuario específico para aplicación
CREATE LOGIN app_user WITH PASSWORD = 'StrongPassword123!';
CREATE USER app_user FOR LOGIN app_user;

-- Otorgar solo permisos necesarios
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.users TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.clients TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.cases TO app_user;
```

### Auditoría

✅ **Implementar**
```typescript
// Tabla de auditoría
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    usuario_id VARCHAR(36),
    accion VARCHAR(20),
    tabla VARCHAR(100),
    id_registro VARCHAR(36),
    cambios_previos NVARCHAR(MAX),
    cambios_nuevos NVARCHAR(MAX),
    ip_address VARCHAR(45),
    fecha_hora DATETIME
);

@Injectable()
export class AuditService {
  async logAction(
    userId: string,
    action: string,
    table: string,
    recordId: string,
    oldValues: any,
    newValues: any,
    ipAddress: string,
  ) {
    await this.databaseService.execute(
      `INSERT INTO audit_logs VALUES (...)`,
      { userId, action, table, recordId, oldValues, newValues, ipAddress }
    );
  }
}
```

## 5. Manejo de Errores y Logging

### No Exponer Información Sensible

✅ **Implementado en HttpExceptionFilter**

```typescript
// ❌ MAL
throw new BadRequestException('Usuario con email juan@example.com no existe');

// ✅ BIEN
throw new BadRequestException('Credenciales inválidas');
```

### Logging Seguro

```typescript
// ❌ MAL
this.logger.log(`User logged in: ${user.password}`);

// ✅ BIEN
this.logger.log(`User logged in: ${user.email}`);
```

## 6. HTTPS/TLS

✅ **Para Producción**

```typescript
// main.ts
import * as fs from 'fs';

async function bootstrap() {
  let app;
  
  if (process.env.NODE_ENV === 'production') {
    const httpsOptions = {
      key: fs.readFileSync(process.env.HTTPS_KEY_PATH),
      cert: fs.readFileSync(process.env.HTTPS_CERT_PATH),
    };
    app = await NestFactory.create(AppModule, new ExpressAdapter());
    https.createServer(httpsOptions, app.getHttpServer());
  } else {
    app = await NestFactory.create(AppModule);
  }
}
```

## 7. Headers de Seguridad

⚠️ **Implementar Helmet**

```bash
npm install helmet
```

```typescript
// main.ts
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(helmet());
  app.use(helmet.contentSecurityPolicy());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.frameguard({ action: 'deny' }));
  
  // ...
}
```

## 8. Actualizaciones y Dependencias

### Verificar Vulnerabilidades

```bash
# Auditar dependencias
npm audit

# Actualizar dependencias
npm audit fix
npm update
```

### Mantener Dependencias Actualizadas

```bash
# Instalar npm-check-updates
npm install -g npm-check-updates

# Ver actualizaciones disponibles
ncu

# Actualizar todo
ncu -u
npm install
```

## 9. Variables de Entorno

✅ **Archivo .env**

```env
# NUNCA hacer commit de .env
# Usar .env.example para plantilla

# Cambiar en producción
JWT_SECRET=generate-a-long-random-string-here
DB_PASSWORD=use-strong-password

# Deshabilitar debug en producción
DEBUG=false
LOG_LEVEL=info
```

### .gitignore

```
.env
.env.local
.env.*.local
node_modules/
dist/
coverage/
```

## 10. Checklist de Seguridad Pre-Producción

- [ ] JWT_SECRET cambiado a valor seguro (min 32 caracteres)
- [ ] NODE_ENV=production en servidor
- [ ] HTTPS habilitado con certificado válido
- [ ] CORS configurado para dominios específicos
- [ ] Rate limiting implementado
- [ ] Helmet instalado y configurado
- [ ] Contraseñas de BD cambiadas
- [ ] Backups configurados
- [ ] Logging de auditoría habilitado
- [ ] Monitoreo y alertas configuradas
- [ ] Firewall configurado
- [ ] Dependencias auditadas (npm audit)
- [ ] Secrets no están en código
- [ ] Errores no exponen detalles técnicos
- [ ] Input validation en todos los endpoints

## 11. Respuesta ante Incidentes

### En caso de compromiso de credenciales

```bash
# Cambiar JWT_SECRET inmediatamente
JWT_SECRET=nuevo-secret-aleatorio

# Invalidar todos los tokens existentes
DELETE FROM token_blacklist;

# Cambiar contraseña de BD
ALTER LOGIN sa WITH PASSWORD = 'new_strong_password';

# Revisar logs de auditoría
SELECT * FROM audit_logs WHERE fecha_hora > DATEADD(day, -7, GETDATE());
```

## 12. Recursos de Seguridad

- [OWASP Top 10](https://owasp.org/Top10)
- [NestJS Security](https://docs.nestjs.com/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [SQL Server Security](https://docs.microsoft.com/en-us/sql/relational-databases/security)

## Soporte de Seguridad

Para reportar vulnerabilidades:
1. NO publicar en issues públicos
2. Enviar a: security@example.com
3. Incluir descripción detallada
4. Dar tiempo para que se corrija (responsibly disclose)
