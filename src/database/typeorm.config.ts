import { DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Client } from '../clients/entities/client.entity';
import { Case } from '../cases/entities/case.entity';
import { File } from '../files/entities/file.entity';

export const typeOrmConfig = (): DataSourceOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User, Client, Case, File],
    synchronize: !isProduction,
    logging: !isProduction,
    migrations: ['dist/migrations/**/*.js'],
    migrationsTableName: 'migrations',
    ssl: { rejectUnauthorized: false },
  };
};
