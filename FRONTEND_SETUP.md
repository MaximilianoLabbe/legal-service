# Guía: Servir Frontend desde Backend NestJS

## 📋 Configuración Realizada

El backend está configurado para servir automáticamente:

- **`GET /api/*`** → API REST normalmente
- **`GET /otros-paths/*`** → Sirve `index.html` para SPA routing
- **Archivos estáticos** → CSS, JS, imágenes desde carpeta `public/`

## 🚀 Pasos para Integrar tu Frontend

### Opción 1: React

```bash
# En tu proyecto React
npm run build

# Copia todos los archivos del build a la carpeta public del backend
xcopy build\* ..\backend-ls\public\ /E /Y
# O en Linux/Mac:
# cp -r build/* ../backend-ls/public/
```

### Opción 2: Vue

```bash
# En tu proyecto Vue
npm run build

# Copia los archivos
xcopy dist\* ..\backend-ls\public\ /E /Y
# O en Linux/Mac:
# cp -r dist/* ../backend-ls/public/
```

### Opción 3: Angular

```bash
# En tu proyecto Angular
ng build --prod

# Copia los archivos
xcopy dist\*\* ..\backend-ls\public\ /E /Y
# O en Linux/Mac:
# cp -r dist/tu-app/* ../backend-ls/public/
```

### Opción 4: Vite

```bash
# En tu proyecto Vite
npm run build

# Copia los archivos
xcopy dist\* ..\backend-ls\public\ /E /Y
```

## 📁 Estructura Final

```
backend-ls/
├── src/
│   ├── app.module.ts (con SpaFallbackMiddleware)
│   ├── main.ts (configurado para servir static assets)
│   └── ...
├── public/                 ← 🔥 Tu frontend aquí
│   ├── index.html
│   ├── assets/
│   ├── js/
│   ├── css/
│   └── ...
├── dist/
├── package.json
└── nest-cli.json
```

## 🔄 Flujo de Solicitudes

```
Cliente: GET /usuarios
├─ ¿Es /api/*? NO
├─ ¿Es /swagger? NO
├─ ¿Existe el archivo? NO
└─ Servir: public/index.html ← Tu SPA maneja la ruta

Cliente: GET /api/users
├─ ¿Es /api/*? SÍ
└─ Procesar normalmente con los controllers de NestJS

Cliente: GET /styles.css
├─ ¿Existe el archivo? SÍ
└─ Servir: public/styles.css
```

## 🛠️ Variables de Entorno

Asegúrate de que en tu `.env` tengas:

```env
API_PREFIX=api
PORT=3000
```

## 📦 Build para Producción

```bash
# Backend
npm install
npm run build

# Se copiará automáticamente la carpeta public al dist
# gracias al script postbuild en package.json
```

## 🧪 Prueba Local

```bash
# Terminal 1: Backend en modo desarrollo
npm run start:dev

# Terminal 2 (si tienes frontend local):
cd tu-frontend
npm start
```

Luego accede a: `http://localhost:3000`

## ⚙️ Configuración Técnica

### Middleware SPA Fallback

El middleware `SpaFallbackMiddleware` se encarga de:

1. ✅ Dejar pasar rutas `/api/*`
2. ✅ Dejar pasar `/swagger` y documentación
3. ✅ Servir archivos estáticos que existan
4. ✅ Para todo lo demás: servir `index.html`

### Static Assets

En `main.ts` se configura:

```typescript
app.useStaticAssets(publicPath, { prefix: '/' });
```

Esto sirve archivos desde `public/` en la raíz (`/`)

## 🐛 Troubleshooting

### "No se ve mi frontend"

1. ✅ Verifica que los archivos estén en `public/`
2. ✅ Revisa que exista `public/index.html`
3. ✅ Reinicia el servidor: `npm run start:dev`

### "Mi SPA no funciona, las rutas no existen"

- El middleware automáticamente sirve `index.html` para rutas no-API
- Tu framework frontend (React, Vue, etc) manejará el routing del lado del cliente

### "Los archivos CSS/JS no cargan"

- Verifica que `public/` contenga los archivos correctos
- Comprueba que las rutas en `index.html` sean relativas (ej: `./assets/main.js`)

### "Las llamadas a API no funcionan"

- Asegúrate que las URLs en tu frontend apunten a `/api/...`
- Ej: `fetch('/api/users')` (no `http://localhost:3000/api/users`)

## 📚 Recursos Adicionales

- [Documentación NestJS - Static Assets](https://docs.nestjs.com/recipes/serve-static)
- [Documentación NestJS - Middleware](https://docs.nestjs.com/middleware)
