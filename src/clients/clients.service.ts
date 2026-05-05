import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  /**
   * Crear nuevo cliente
   * @param createClientDto - Datos del cliente
   */
  async create(createClientDto: CreateClientDto): Promise<Client> {
    const { user_id, rut, nombre, telefono, email } = createClientDto;

    // Verificar si el cliente con ese RUT ya existe
    const existingClient = await this.clientRepository.findOne({ where: { rut } });
    if (existingClient) {
      throw new ConflictException(`El cliente con RUT ${rut} ya existe`);
    }

    const client = this.clientRepository.create({
      user_id,
      rut,
      nombre,
      telefono,
      email,
    });

    const savedClient = await this.clientRepository.save(client);
    this.logger.log(`Client created: ${nombre} (${rut}) for user ${user_id}`);

    return savedClient;
  }

  /**
   * Obtener cliente por ID
   * @param id - ID del cliente
   */
  async findById(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return client;
  }

  /**
   * Obtener cliente por RUT
   * @param rut - RUT del cliente
   */
  async findByRut(rut: string): Promise<Client | null> {
    return this.clientRepository.findOne({ where: { rut } });
  }

  /**
   * Obtener todos los clientes
   */
  async findAll(): Promise<Client[]> {
    return this.clientRepository.find({ order: { nombre: 'ASC' } });
  }

  /**
   * Actualizar cliente
   * @param id - ID del cliente
   * @param updateClientDto - Datos a actualizar
   */
  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    if (updateClientDto.user_id) {
      client.user_id = updateClientDto.user_id;
    }

    if (updateClientDto.rut && updateClientDto.rut !== client.rut) {
      const existingClient = await this.clientRepository.findOne({
        where: { rut: updateClientDto.rut },
      });
      if (existingClient) {
        throw new ConflictException(`El RUT ${updateClientDto.rut} ya está en uso`);
      }
      client.rut = updateClientDto.rut;
    }

    if (updateClientDto.nombre) {
      client.nombre = updateClientDto.nombre;
    }

    if (updateClientDto.telefono) {
      client.telefono = updateClientDto.telefono;
    }

    if (updateClientDto.email) {
      client.email = updateClientDto.email;
    }

    await this.clientRepository.save(client);
    this.logger.log(`Client updated: ${id}`);

    return client;
  }

  /**
   * Eliminar cliente
   * @param id - ID del cliente
   */
  async remove(id: string): Promise<void> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    await this.clientRepository.remove(client);
    this.logger.log(`Client deleted: ${id}`);
  }

  /**
   * Obtener total de clientes
   */
  async count(): Promise<number> {
    return this.clientRepository.count();
  }
}
