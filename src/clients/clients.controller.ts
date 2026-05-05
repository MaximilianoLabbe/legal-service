import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Clients')
@Controller('clients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  /**
   * Crear nuevo cliente
   * POST /clients
   */
  @Post()
  @ApiOperation({ summary: 'Crear cliente', description: 'Crea un nuevo cliente en el sistema' })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente' })
  @ApiResponse({ status: 400, description: 'RUT duplicado o datos inválidos' })
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  /**
   * Obtener todos los clientes
   * GET /clients
   */
  @Get()
  @ApiOperation({ summary: 'Listar clientes', description: 'Obtiene la lista de todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  async findAll() {
    return this.clientsService.findAll();
  }

  /**
   * Obtener cliente por ID
   * GET /clients/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener cliente por ID', description: 'Obtiene los detalles de un cliente específico' })
  @ApiParam({ name: 'id', description: 'UUID del cliente' })
  @ApiResponse({ status: 200, description: 'Datos del cliente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async findById(@Param('id') id: string) {
    return this.clientsService.findById(id);
  }

  /**
   * Buscar cliente por RUT
   * GET /clients/search/rut?rut=12345678-K
   */
  @Get('search/rut')
  @ApiOperation({ summary: 'Buscar cliente por RUT', description: 'Busca un cliente por su RUT chileno' })
  @ApiQuery({ name: 'rut', description: 'RUT del cliente (ej: 12345678-K)' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async findByRut(@Query('rut') rut: string) {
    return this.clientsService.findByRut(rut);
  }

  /**
   * Actualizar cliente
   * PUT /clients/:id
   */
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar cliente', description: 'Actualiza los datos de un cliente' })
  @ApiParam({ name: 'id', description: 'UUID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  /**
   * Eliminar cliente
   * DELETE /clients/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar cliente', description: 'Elimina un cliente del sistema' })
  @ApiParam({ name: 'id', description: 'UUID del cliente' })
  @ApiResponse({ status: 204, description: 'Cliente eliminado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }

  /**
   * Obtener total de clientes
   * GET /clients/stats/count
   */
  @Get('stats/count')
  @ApiOperation({ summary: 'Estadísticas de clientes', description: 'Obtiene el total de clientes en el sistema' })
  @ApiResponse({ status: 200, description: 'Total de clientes', schema: { example: { total: 5 } } })
  async count() {
    const total = await this.clientsService.count();
    return { total };
  }
}
