# Deploy en Render - Legal Management Backend

Guía completa para desplegar el backend NestJS en Render.

## ¿Por qué Render?

- ✅ Soporte nativo para Node.js/NestJS
- ✅ PostgreSQL integrada (Neon funciona perfectamente)
- ✅ Plan gratuito generoso
- ✅ No necesita configuración serverless complicada
- ✅ Despliegue automático desde GitHub

## Prerequisitos

1. Cuenta en [Render.com](https://render.com) (gratis)
2. GitHub conectado a Render
3. Base de datos Neon con `DATABASE_URL`
4. JWT_SECRET generado

## Pasos de Deployment

### 1. Preparar Variables de Entorno

Tienes dos opciones:

**Opción A: Usar render.yaml (recomendado)**
- El archivo `render.yaml` ya está configurado
- Render lo detectará automáticamente

**Opción B: Configurar manualmente**
- Variables que necesitas en Render:

```
NODE_ENV = production
DATABASE_URL = [Tu conexión Neon]
JWT_SECRET = [Tu cadena aleatoria fuerte]
JWT_EXPIRATION = 15m
JWT_REFRESH_EXPIRATION = 7d
PORT = 3000
```

### 2. Conectar GitHub a Render

1. Ve a [dashboard.render.com](https://dashboard.render.com)
2. Click en "New +"
3. Selecciona "Web Service"
4. Selecciona "Deploy an existing Git repository"
5. Si no ves el repo, click en "Connect account" para conectar GitHub
6. Busca y selecciona `legal-service`

### 3. Configurar el Web Service

**Opciones principales:**

- **Name:** `legal-service` (o el nombre que prefieras)
- **Environment:** Node
- **Region:** Virginia (usa-east-1)
- **Branch:** main
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start:prod`
- **Plan:** Free (suficiente para desarrollo)

### 4. Variables de Entorno en Render

Si no usas `render.yaml`:

1. En la sección "Advanced"
2. Click en "Add Environment Variable"
3. Agrega cada variable:

```
NODE_ENV = production
DATABASE_URL = postgresql://neondb_owner:npg_...@ep-...pooler.c-8.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require
JWT_SECRET = a3f8d2c9e1b4f6a8c7e9d2f5b8a1c4e7f9a2b5d8e1f4a7c9e2f5b8a1c4e7
JWT_EXPIRATION = 15m
JWT_REFRESH_EXPIRATION = 7d
```

**⚠️ IMPORTANTE:** 
- No incluyas comillas en los values
- Para `DATABASE_URL`, copia la URL completa de Neon
- Para `JWT_SECRET`, usa la cadena generada sin corchetes

### 5. Desplegar

1. Una vez configurado todo, click en "Create Web Service"
2. Render comenzará el deploy automáticamente
3. Espera 3-5 minutos mientras descarga dependencias y compila

### 6. Verificar el Deployment

En el dashboard de Render:

1. Verifica que el estado sea **"Live"** (verde)
2. Ve al tab "Environment"
3. Copia la URL de tu servicio (ej: `https://legal-service-abc123.onrender.com`)

**Accede a tu app:**

```
- API base:    https://legal-service-abc123.onrender.com/api
- Swagger:     https://legal-service-abc123.onrender.com/api/swagger
- Login:       https://legal-service-abc123.onrender.com/api/auth/login (POST)
```

## Logs en Tiempo Real

Para ver logs mientras se ejecuta:

1. En Render dashboard, ve a tu servicio
2. Click en "Logs"
3. Verás todos los logs en tiempo real

## Solución de Problemas

### Error: "Failed to build"

**Solución:**
- Revisa los logs en Render
- Verifica que todas las dependencias estén instaladas
- Asegúrate de que `npm run build` compila sin errores localmente

```bash
npm run build  # Prueba localmente
```

### Error: "Cannot connect to DATABASE_URL"

**Causas posibles:**
1. `DATABASE_URL` mal configurada
2. Neon fuera de línea
3. Pool de conexiones lleno

**Solución:**
- Verifica que la URL sea correcta
- Ve a Neon Console y comprueba que la base de datos está activa
- Revisa en Render → Settings → Environment Variables

### Error: "Cannot GET /api"

**Solución:**
- La app tarda en iniciar. Espera 1-2 minutos más
- Intenta `GET /api/health` en su lugar
- Revisa los logs en Render

### La app se reinicia constantemente

**Causa:** Probablemente error en la conexión a base de datos

**Solución:**
- Ve a Render → Logs
- Busca líneas que digan "error" o "ERROR"
- Verifica las variables de entorno

## Despliegues Automáticos

Render redeploy automáticamente cuando haces `git push` a `main`:

```bash
git add .
git commit -m "Nueva feature"
git push origin main
# Render automáticamente detecta el cambio y redeploy
```

Para deshabilitar redeploy automático:
- Settings → Auto-Deploy → Disabled

## Redeploy Manual

Si necesitas redeploy sin hacer push:

1. En Render dashboard
2. Click en tu servicio
3. Click en "Manual Deploy"
4. Selecciona la rama (main)
5. Click "Deploy latest commit"

## Actualizaciones y Rollback

Cada deployment crea una versión que puedes restaurar:

1. En Render → "Deployments"
2. Verás todo el historial
3. Click en la versión que quieres restaurar
4. Click "Rollback"

## Límites del Plan Gratuito

- 750 horas/mes de compute (suficiente para 1 app en modo always-on)
- Sin SSL/TLS personalizado
- 100 MB de almacenamiento
- La app se pausará después de 15 minutos sin tráfico (se reinicia con la siguiente solicitud)

## Upgrade a Plan Pagado (Recomendado para Producción)

Si necesitas mejor rendimiento:
- Click en Settings → Change Plan
- Starter ($12/mes): Sin pausas, mejor performance

## URLs Útiles

- Dashboard: https://dashboard.render.com
- Documentación: https://render.com/docs
- Estado: https://status.render.com

---

**¿Preguntas?** Revisa los logs en Render o contacta soporte.

**Próximos pasos:**
1. ✅ Configuración en GitHub (ya hecho)
2. ⬜ Conectar en Render
3. ⬜ Configurar variables de entorno
4. ⬜ Desplegar
5. ⬜ Verificar Swagger funciona
6. ⬜ Probar endpoints

**Última actualización:** Mayo 2026
