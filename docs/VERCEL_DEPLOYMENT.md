# Deploy a Vercel - Legal Management Backend

Este documento describe cómo desplegar el backend NestJS en Vercel.

## Prerrequisitos

- Cuenta en [Vercel](https://vercel.com) (gratuita)
- Repositorio en GitHub con el código
- Base de datos Neon PostgreSQL configurada (con `DATABASE_URL`)

## Pasos para el Deploy

### 1. Conectar GitHub a Vercel

1. Inicia sesión en [vercel.com](https://vercel.com)
2. Click en "Add New..." → "Project"
3. Selecciona "Import Git Repository"
4. Busca y selecciona el repositorio `legal-service`
5. Click en "Import"

### 2. Configurar Variables de Entorno

Después de importar el proyecto:

1. Vercel te mostrará la pantalla de configuración
2. Click en "Environment Variables" 
3. Agrega las siguientes variables:

```
NODE_ENV = production
DATABASE_URL = [Tu URL de Neon PostgreSQL]
JWT_SECRET = [Genera una cadena aleatoria fuerte]
JWT_EXPIRATION = 15m
JWT_REFRESH_EXPIRATION = 7d
```

**Para obtener `DATABASE_URL` de Neon:**
- Ve a tu proyecto en Neon Console
- Copia la "Connection string" de la rama "production"
- Debe incluir `?channel_binding=require&sslmode=require`

**Para generar `JWT_SECRET`:**
```bash
# En tu terminal local:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. Asegúrate de que las variables estén en el ambiente "Production"
5. Click en "Deploy"

### 3. Verificar el Deployment

Una vez que Vercel termine el build (2-3 minutos):

1. Accede a tu aplicación en `https://[your-project].vercel.app`
2. Verifica la salud del API: `GET /api`
3. Accede a Swagger: `https://[your-project].vercel.app/api/swagger`

### 4. Prueba de Conexión

```bash
# Obtener información de la app
curl https://[your-project].vercel.app/api

# Ver Swagger
curl https://[your-project].vercel.app/api/swagger
```

## Troubleshooting

### Error: "DATABASE_URL is not defined"

**Solución:** 
- Verifica que hayas agregado `DATABASE_URL` en Environment Variables
- Asegúrate de que está en el ambiente "Production"
- Redeploy después de agregar la variable

### Error: "Connection timeout"

**Posible causa:** La base de datos de Neon está fuera de línea o el pool está lleno

**Soluciones:**
- Verifica que la base de datos Neon esté activa
- Intenta reconectar en Neon Console
- Verifica que no haya demasiadas conexiones simultáneas

### Build exitoso pero aplicación devuelve error 500

**Soluciones:**
- Revisa los logs en Vercel: Settings → Functions → Logs
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que la base de datos tenga el schema (ejecuta `DATABASE_SETUP.sql`)

## Redeploy

Para redeploy después de cambios en el código:

### Opción 1: Automático (recomendado)
- Haz `git push` a la rama `main`
- Vercel automáticamente detectará el cambio y hará rebuild

### Opción 2: Manual
1. Ve al dashboard de Vercel
2. Click en "Deployments"
3. Click en "Redeploy" en el deployment actual

## Monitoreo

### Ver logs en tiempo real:
1. Ve a tu proyecto en Vercel
2. Click en "Functions"
3. Selecciona `dist/main.js`
4. Ver logs de ejecución

### Métricas:
- Vercel proporciona métricas en "Analytics"
- Tiempo de respuesta, errores, ancho de banda

## Base de Datos

### Schema en Neon

Después del primer deploy, ejecuta el schema en Neon:

1. Ve a Neon Console
2. Conecta con el SQL Editor
3. Copia el contenido de `DATABASE_SETUP.sql`
4. Ejecuta el SQL

O usa la CLI de Neon:
```bash
psql "postgresql://user:pass@host/database" -f DATABASE_SETUP.sql
```

## Limitaciones de Vercel

- **Timeout de función:** 60 segundos (máx en plan gratuito)
- **Memoria:** 1024 MB (ajustable en `vercel.json`)
- **Conexiones simultáneas:** Limitadas por el plan

## Escala y Optimizaciones

Si necesitas mayor rendimiento:

1. **Upgrade de plan Vercel:** Pro ($20/mes) permite 300 segundos timeout
2. **Neon Pro:** Para mejor performance de base de datos
3. **Aumentar memoria en `vercel.json`:** Máximo 3008 MB

## Próximos Pasos

1. Configura un dominio personalizado
2. Habilita "Preview Deployments" para PRs
3. Configura notificaciones de errores
4. Monitorea con Sentry o similar

---

**Última actualización:** Mayo 2026
**Versión:** 1.0
