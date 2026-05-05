import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global prefix
  const apiPrefix = configService.get<string>('API_PREFIX', 'api');
  app.setGlobalPrefix(apiPrefix);

  // Swagger configuration (DESPUÉS del prefijo global para que esté en /api/swagger)
  const config = new DocumentBuilder()
    .setTitle('Legal Management System API')
    .setDescription(
      'API profesional para gestión de casos legales y clientes con autenticación JWT',
    )
    .setVersion('1.0.0')
    .setBasePath(apiPrefix)
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
      urls: [
        {
          url: `/`,
          name: 'Development',
        },
      ],
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
