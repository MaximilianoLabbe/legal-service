import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { CasesModule } from './cases/cases.module';
import { FilesModule } from './files/files.module';
import { TasksModule } from './tasks/tasks.module';
import { GoogleDriveModule } from './google-drive/google-drive.module';
import { TypeOrmConfigModule } from './database/typeorm-config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { SpaFallbackMiddleware } from './common/middleware/spa-fallback.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmConfigModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    CasesModule,
    FilesModule,
    TasksModule,
    GoogleDriveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplicar el middleware SPA a todas las rutas
    consumer.apply(SpaFallbackMiddleware).forRoutes('*');
  }

export class AppModule {}
