import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Client } from '../clients/entities/client.entity';
import { Case } from '../cases/entities/case.entity';
import { File } from '../files/entities/file.entity';
import { Task } from '../tasks/entities/task.entity';
import { TaskHistory } from '../tasks/entities/task-history.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const isProduction = configService.get<string>('NODE_ENV') === 'production';

        if (!databaseUrl) {
          throw new Error('DATABASE_URL environment variable is not defined');
        }

        return {
          type: 'postgres',
          url: databaseUrl,
          entities: [User, Client, Case, File, Task, TaskHistory],
          synchronize: false, // Disabled - manage schema manually via DATABASE_SETUP.sql
          logging: !isProduction,
          ssl: { rejectUnauthorized: false },
        };
      },
    }),
    TypeOrmModule.forFeature([User, Client, Case, Task, TaskHistory]),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmConfigModule {}
