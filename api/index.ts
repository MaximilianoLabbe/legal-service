import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';

let app: any;

async function createApp() {
  if (app) return app;

  app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const configService = app.get(ConfigService);

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

  // Global prefix
  const apiPrefix = configService.get('API_PREFIX') || 'api';
  app.setGlobalPrefix(apiPrefix);

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Swagger configuration
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

  await app.init();
  return app;
}

export default async (req: any, res: any) => {
  const app = await createApp();
  app.getHttpAdapter().getInstance()(req, res);
};
