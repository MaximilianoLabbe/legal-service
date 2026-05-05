import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * DatabaseService proporciona la capa de acceso a datos
 * Soporta SQL Server y Oracle DB
 * Usa queries directas o repository pattern
 */
@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private connection: any;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      await this.connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.disconnect();
    }
  }

  /**
   * Conectar a la base de datos
   * En un proyecto real, aquí se configuraría el driver específico
   */
  private async connect() {
    const dbType = this.configService.get<string>('database.type');
    this.logger.log(`Connecting to ${dbType} database...`);

    // Aquí iría la lógica real de conexión
    // Por ahora simulamos la conexión
    // En producción: usar mssql package para SQL Server o oracledb para Oracle
  }

  /**
   * Desconectar de la base de datos
   */
  private async disconnect() {
    this.logger.log('Disconnecting from database...');
    // Aquí iría la lógica real de desconexión
  }

  /**
   * Ejecutar query SELECT
   * @param sql - Query SQL
   * @param _params - Parámetros de la query
   */
  async query<T = any>(sql: string, _params?: any): Promise<T[]> {
    try {
      this.logger.debug(`Executing query: ${sql}`);
      // Aquí iría la lógica real de ejecución
      // Retorna array de resultados
      return [];
    } catch (error) {
      this.logger.error(`Error executing query: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Ejecutar INSERT, UPDATE o DELETE
   * @param sql - Query SQL
   * @param _params - Parámetros de la query
   */
  async execute(sql: string, _params?: any): Promise<any> {
    try {
      this.logger.debug(`Executing: ${sql}`);
      // Aquí iría la lógica real de ejecución
      // Retorna resultado de la operación
      return { affected: 0 };
    } catch (error) {
      this.logger.error(`Error executing: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Obtener un registro por ID
   * @param table - Nombre de la tabla
   * @param id - ID del registro
   */
  async findById<T = any>(table: string, id: string | number): Promise<T | null> {
    const sql = `SELECT * FROM ${table} WHERE id = @id`;
    const result = await this.query<T>(sql, { id });
    return result[0] || null;
  }

  /**
   * Obtener todos los registros de una tabla
   * @param table - Nombre de la tabla
   */
  async findAll<T = any>(table: string): Promise<T[]> {
    const sql = `SELECT * FROM ${table}`;
    return this.query<T>(sql);
  }

  /**
   * Obtener la configuración de base de datos
   */
  getDatabaseConfig() {
    return this.configService.get('database');
  }
}
