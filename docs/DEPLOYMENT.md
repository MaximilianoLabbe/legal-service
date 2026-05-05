# Deployment Guide

Guía para desplegar el backend en diferentes ambientes.

## Desarrollo Local

### Requisitos
- Node.js 18+
- SQL Server o Oracle DB

### Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd backend-ls

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Editar .env con valores locales
nano .env

# Ejecutar en modo desarrollo
npm run start:dev
```

El servidor estará disponible en `http://localhost:3000/api`

## Docker

### Requisitos
- Docker
- Docker Compose

### Levantar servicios con Docker Compose

```bash
# Iniciar servicios (SQL Server + Redis)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### Build y run de imagen Docker

```bash
# Build imagen
docker build -t legal-backend:latest .

# Ejecutar contenedor
docker run -d \
  --name legal-backend \
  -p 3000:3000 \
  -e JWT_SECRET=your-secret-key \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=1433 \
  legal-backend:latest

# Ver logs
docker logs -f legal-backend

# Detener contenedor
docker stop legal-backend
```

## Producción

### Requisitos Previos
- Servidor Linux (Ubuntu 20.04 LTS recomendado)
- Node.js 18 LTS
- SQL Server o Oracle DB
- PM2 o similar para process management
- Nginx como reverse proxy

### Instalación en Servidor

```bash
# Conectarse al servidor
ssh user@server-ip

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2

# Clonar código
git clone <repository-url> /var/www/legal-backend
cd /var/www/legal-backend

# Instalar dependencias
npm ci --production

# Build
npm run build

# Crear archivo .env con valores de producción
nano .env
```

### Configuración de PM2

```bash
# Crear archivo ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'legal-backend',
    script: './dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
EOF

# Iniciar aplicación con PM2
pm2 start ecosystem.config.js

# Hacer que PM2 inicie en el arranque del servidor
pm2 startup
pm2 save
```

### Configuración de Nginx

```bash
# Instalar Nginx
sudo apt install -y nginx

# Crear archivo de configuración
sudo nano /etc/nginx/sites-available/legal-backend

# Contenido:
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Habilitar configuración
sudo ln -s /etc/nginx/sites-available/legal-backend /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### SSL/TLS con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d api.example.com

# Renovación automática
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Monitoreo

```bash
# Ver procesos de PM2
pm2 status

# Ver logs en tiempo real
pm2 logs

# Monitoring
pm2 monit
```

## CI/CD (GitHub Actions)

Crear archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build

    - name: Deploy
      env:
        DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
        DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
      run: |
        mkdir -p ~/.ssh
        echo "$DEPLOY_KEY" > ~/.ssh/deploy_key
        chmod 600 ~/.ssh/deploy_key
        ssh-keyscan -H $DEPLOY_HOST >> ~/.ssh/known_hosts
        scp -i ~/.ssh/deploy_key -r dist package*.json $DEPLOY_USER@$DEPLOY_HOST:/var/www/legal-backend/
        ssh -i ~/.ssh/deploy_key $DEPLOY_USER@$DEPLOY_HOST 'cd /var/www/legal-backend && npm ci --production && pm2 restart legal-backend'
```

## Monitoreo y Logs

### Estructura de logs

```
logs/
├── app.log          # Logs generales
├── error.log        # Errores
└── access.log       # Acceso HTTP
```

### Configurar rotación de logs

```bash
# Instalar logrotate
sudo apt install -y logrotate

# Crear configuración
sudo nano /etc/logrotate.d/legal-backend
```

Contenido:

```
/var/www/legal-backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 nodejs nodejs
    sharedscripts
    postrotate
        pm2 reload legal-backend
    endscript
}
```

## Backup

```bash
# Backup automático de base de datos
0 2 * * * /usr/local/bin/backup-db.sh

# Script backup-db.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/legal-backend"
mkdir -p $BACKUP_DIR

# SQL Server
sqlcmd -S localhost -U sa -P $SA_PASSWORD \
  -Q "BACKUP DATABASE legal_management TO DISK = '$BACKUP_DIR/legal_management_$DATE.bak'"

# Comprimir
gzip "$BACKUP_DIR/legal_management_$DATE.bak"

# Borrar backups más antiguos de 30 días
find $BACKUP_DIR -name "*.bak.gz" -mtime +30 -delete
```

## Troubleshooting

### Aplicación no inicia

```bash
# Ver logs de PM2
pm2 logs legal-backend

# Verificar variables de entorno
pm2 show legal-backend

# Reiniciar aplicación
pm2 restart legal-backend
```

### Problemas de conexión a BD

```bash
# Probar conexión a SQL Server
sqlcmd -S localhost -U sa -P password -Q "SELECT @@VERSION"

# Probar conexión a Oracle
sqlplus username/password@ORCL
```

### Alto uso de memoria

```bash
# Monitorear memoria
pm2 monit

# Aumentar límite de memoria en Node.js
pm2 start ecosystem.config.js --node-args="--max-old-space-size=4096"
```

## Health Check

```bash
# Verificar que la aplicación está corriendo
curl http://localhost:3000/health

# En Nginx
location /health {
    proxy_pass http://127.0.0.1:3000/health;
    access_log off;
}
```

## Seguridad en Producción

1. **Cambiar JWT_SECRET** en variables de entorno
2. **Usar HTTPS** (Let's Encrypt)
3. **Limitar tasa de peticiones** con Nginx
4. **Habilitar CORS** solo para dominios permitidos
5. **Usar firewall** para controlar acceso
6. **Actualizar dependencias** regularmente
7. **Monitorear logs** para actividades sospechosas
8. **Hacer backups** regularmente
9. **Usar variables de entorno** para datos sensibles
10. **Deshabilitar endpoints de debug** en producción
