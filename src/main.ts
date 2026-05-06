import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // CORS first
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // ========== MIDDLEWARE SPA FALLBACK - EJECUTA PRIMERO ==========
  const apiPrefix = configService.get<string>('API_PREFIX', 'api');
  const publicPath = path.join(process.cwd(), 'public');

  // Este middleware Express se ejecuta ANTES de que NestJS maneje las rutas
  app.use((req: Request, res: Response, next: NextFunction) => {
    const { path: reqPath } = req;

    // 1. Si es API, dejar pasar a NestJS
    if (reqPath.startsWith(`/${apiPrefix}`)) {
      return next();
    }

    // 2. Si es Swagger o documentación especial
    if (reqPath.startsWith('/swagger') || reqPath === '/favicon.ico') {
      return next();
    }

    // 3. Si el archivo existe como archivo estático, servirlo
    const filePath = path.join(publicPath, reqPath.split('?')[0]);
    try {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return next();
      }
    } catch (error) {
      // Continuar si hay error
    }

    // 4. Para todo lo demás (rutas SPA), servir index.html
    const indexPath = path.join(publicPath, 'index.html');
    try {
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
    } catch (error) {
      console.error('Error sirviendo index.html:', error.message);
    }

    // Si falla todo, dejar pasar a NestJS
    next();
  });

  // Servir archivos estáticos después del middleware SPA
  app.use(express.static(publicPath, {
    maxAge: '1d',
    etag: false,
  }));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Set global prefix AFTER middleware
  app.setGlobalPrefix(apiPrefix);
  const config = new DocumentBuilder()
    .setTitle('Legal Management System API')
    .setDescription(
      'API profesional para gestión de casos legales y clientes con autenticación JWT',
    )
    .setVersion('1.0.0')
    .addTag('Auth', 'Autenticación y gestión de sesiones')
    .addTag('Users', 'Gestión de usuarios del sistema')
    .addTag('Clients', 'Gestión de clientes')
    .addTag('Cases', 'Gestión de casos legales')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
    },
  });

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port, '0.0.0.0');

  console.log(`✅ Application is running on: http://0.0.0.0:${port}/${apiPrefix}`);
  console.log(`📚 Swagger documentation: http://0.0.0.0:${port}/${apiPrefix}/swagger`);
}

bootstrap().catch((err) => {
  console.error('❌ Application failed to start:', err);
  process.exit(1);
});
