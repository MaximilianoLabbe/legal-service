import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientsService } from '../clients/clients.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { Case } from './entities/case.entity';

@Injectable()
export class CasesService {
  private readonly logger = new Logger(CasesService.name);

  constructor(
    @InjectRepository(Case)
    private readonly caseRepository: Repository<Case>,
    private clientsService: ClientsService,
  ) {}

  /**
   * Crear nuevo caso
   * @param createCaseDto - Datos del caso
   */
  async create(createCaseDto: CreateCaseDto): Promise<Case> {
    const { user_id, client_id, tipo, estado, descripcion, fecha_inicio, fecha_fin } = createCaseDto;

    // Verificar que el cliente existe
    await this.clientsService.findById(client_id);

    // Validar que fecha_inicio sea menor a fecha_fin si se proporciona
    if (fecha_inicio && fecha_fin) {
      const inicio = new Date(fecha_inicio);
      const fin = new Date(fecha_fin);
      if (inicio > fin) {
        throw new BadRequestException('fecha_inicio debe ser menor a fecha_fin');
      }
    }

    const caseData: any = {
      user_id,
      client_id,
      tipo,
      estado: estado || 'abierto',
      descripcion,
      fecha_inicio: new Date(fecha_inicio),
    };

    if (fecha_fin) {
      caseData.fecha_fin = new Date(fecha_fin);
    }

    const caseRecord = this.caseRepository.create(caseData);

    const savedCase = (await this.caseRepository.save(caseRecord)) as unknown as Case;
    this.logger.log(`Case created: ${savedCase.id} for client ${client_id} by user ${user_id}`);

    return savedCase;
  }

  /**
   * Obtener caso por ID
   * @param id - ID del caso
   */
  async findById(id: string): Promise<Case> {
    const caseRecord = await this.caseRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!caseRecord) {
      throw new NotFoundException(`Caso con ID ${id} no encontrado`);
    }

    return caseRecord;
  }

  /**
   * Obtener todos los casos
   */
  async findAll(): Promise<Case[]> {
    return this.caseRepository.find({
      order: { fecha_inicio: 'DESC' },
      relations: ['client'],
    });
  }

  /**
   * Obtener casos por cliente
   * @param client_id - ID del cliente
   */
  async findByClientId(client_id: string): Promise<Case[]> {
    // Verificar que el cliente existe
    await this.clientsService.findById(client_id);

    return this.caseRepository.find({
      where: { client_id },
      order: { fecha_inicio: 'DESC' },
      relations: ['client'],
    });
  }

  /**
   * Obtener casos por usuario (abogado)
   * @param user_id - ID del usuario
   */
  async findByUserId(user_id: string): Promise<Case[]> {
    return this.caseRepository.find({
      where: { user_id },
      order: { fecha_inicio: 'DESC' },
      relations: ['client', 'user'],
    });
  }

  /**
   * Actualizar caso
   * @param id - ID del caso
   * @param updateCaseDto - Datos a actualizar
   */
  async update(id: string, updateCaseDto: UpdateCaseDto): Promise<Case> {
    const caseRecord = await this.caseRepository.findOne({ where: { id } });

    if (!caseRecord) {
      throw new NotFoundException(`Caso con ID ${id} no encontrado`);
    }

    // Actualizar user_id si se proporciona
    if (updateCaseDto.user_id) {
      caseRecord.user_id = updateCaseDto.user_id;
    }

    // Si se actualiza client_id, verificar que existe
    if (updateCaseDto.client_id && updateCaseDto.client_id !== caseRecord.client_id) {
      await this.clientsService.findById(updateCaseDto.client_id);
      caseRecord.client_id = updateCaseDto.client_id;
    }

    if (updateCaseDto.tipo) {
      caseRecord.tipo = updateCaseDto.tipo;
    }

    if (updateCaseDto.estado) {
      caseRecord.estado = updateCaseDto.estado;
    }

    if (updateCaseDto.descripcion) {
      caseRecord.descripcion = updateCaseDto.descripcion;
    }

    if (updateCaseDto.fecha_inicio) {
      caseRecord.fecha_inicio = new Date(updateCaseDto.fecha_inicio);
    }

    if (updateCaseDto.fecha_fin) {
      caseRecord.fecha_fin = new Date(updateCaseDto.fecha_fin);
    }

    await this.caseRepository.save(caseRecord);
    this.logger.log(`Case updated: ${id}`);

    return this.findById(id);
  }

  /**
   * Eliminar caso
   * @param id - ID del caso
   */
  async remove(id: string): Promise<void> {
    const caseRecord = await this.caseRepository.findOne({ where: { id } });

    if (!caseRecord) {
      throw new NotFoundException(`Caso con ID ${id} no encontrado`);
    }

    await this.caseRepository.remove(caseRecord);
    this.logger.log(`Case deleted: ${id}`);
  }

  /**
   * Obtener estadísticas de casos
   */
  async getStats(): Promise<any> {
    const stats = await this.caseRepository
      .createQueryBuilder('c')
      .select('COUNT(*)', 'total')
      .addSelect("SUM(CASE WHEN c.estado = 'abierto' THEN 1 ELSE 0 END)", 'abiertos')
      .addSelect("SUM(CASE WHEN c.estado = 'cerrado' THEN 1 ELSE 0 END)", 'cerrados')
      .addSelect("SUM(CASE WHEN c.estado = 'en_progreso' THEN 1 ELSE 0 END)", 'en_progreso')
      .addSelect("SUM(CASE WHEN c.estado = 'pausado' THEN 1 ELSE 0 END)", 'pausados')
      .getRawOne();

    return {
      total: parseInt(stats.total || 0),
      abiertos: parseInt(stats.abiertos || 0),
      cerrados: parseInt(stats.cerrados || 0),
      en_progreso: parseInt(stats.en_progreso || 0),
      pausados: parseInt(stats.pausados || 0),
    };
  }

  /**
   * Cambiar estado del caso
   * @param id - ID del caso
   * @param estado - Nuevo estado
   */
  async changeStatus(id: string, estado: string): Promise<Case> {
    const validStatuses = ['abierto', 'en_progreso', 'cerrado', 'pausado'];

    if (!validStatuses.includes(estado)) {
      throw new BadRequestException(
        `Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}`,
      );
    }

    return this.update(id, { estado });
  }
}
