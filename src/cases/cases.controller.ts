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
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { ChangeCaseStatusDto } from './dto/change-case-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Cases')
@Controller('cases')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  /**
   * Crear nuevo caso
   * POST /cases
   */
  @Post()
  @ApiOperation({ summary: 'Crear caso', description: 'Crea un nuevo caso legal en el sistema' })
  @ApiResponse({ status: 201, description: 'Caso creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Cliente no encontrado o datos inválidos' })
  async create(@Body() createCaseDto: CreateCaseDto) {
    return this.casesService.create(createCaseDto);
  }

  /**
   * Obtener todos los casos
   * GET /cases
   */
  @Get()
  @ApiOperation({ summary: 'Listar casos', description: 'Obtiene la lista de todos los casos legales' })
  @ApiResponse({ status: 200, description: 'Lista de casos' })
  async findAll() {
    return this.casesService.findAll();
  }

  /**
   * Obtener estadísticas de casos
   * GET /cases/stats
   */
  @Get('stats')
  @ApiOperation({ summary: 'Estadísticas de casos', description: 'Obtiene estadísticas generales de los casos' })
  @ApiResponse({ status: 200, description: 'Estadísticas de casos', schema: { example: { total: 10, por_estado: { abierto: 5, en_progreso: 3, cerrado: 2, pausado: 0 } } } })
  async getStats() {
    return this.casesService.getStats();
  }

  /**
   * Obtener casos por usuario (abogado)
   * GET /cases/user/:user_id
   */
  @Get('user/:user_id')
  @ApiOperation({ summary: 'Casos por usuario', description: 'Obtiene todos los casos asignados a un usuario/abogado' })
  @ApiParam({ name: 'user_id', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de casos del usuario' })
  async findByUserId(@Param('user_id') user_id: string) {
    return this.casesService.findByUserId(user_id);
  }

  /**
   * Obtener caso por ID
   * GET /cases/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener caso por ID', description: 'Obtiene los detalles de un caso específico' })
  @ApiParam({ name: 'id', description: 'UUID del caso' })
  @ApiResponse({ status: 200, description: 'Datos del caso' })
  @ApiResponse({ status: 404, description: 'Caso no encontrado' })
  async findById(@Param('id') id: string) {
    return this.casesService.findById(id);
  }

  /**
   * Obtener casos por cliente
   * GET /cases/client/:client_id
   */
  @Get('client/:client_id')
  @ApiOperation({ summary: 'Casos por cliente', description: 'Obtiene todos los casos asociados a un cliente' })
  @ApiParam({ name: 'client_id', description: 'UUID del cliente' })
  @ApiResponse({ status: 200, description: 'Lista de casos del cliente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async findByClientId(@Param('client_id') client_id: string) {
    return this.casesService.findByClientId(client_id);
  }

  /**
   * Actualizar caso
   * PUT /cases/:id
   */
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar caso', description: 'Actualiza los datos de un caso legal' })
  @ApiParam({ name: 'id', description: 'UUID del caso' })
  @ApiResponse({ status: 200, description: 'Caso actualizado' })
  @ApiResponse({ status: 404, description: 'Caso no encontrado' })
  async update(@Param('id') id: string, @Body() updateCaseDto: UpdateCaseDto) {
    return this.casesService.update(id, updateCaseDto);
  }

  /**
   * Cambiar estado del caso
   * PATCH /cases/:id/status
   */
  @Patch(':id/status')
  @ApiOperation({ summary: 'Cambiar estado', description: 'Cambia el estado de un caso (abierto, en_progreso, cerrado, pausado)' })
  @ApiParam({ name: 'id', description: 'UUID del caso' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 404, description: 'Caso no encontrado' })
  async changeStatus(@Param('id') id: string, @Body() changeCaseStatusDto: ChangeCaseStatusDto) {
    return this.casesService.changeStatus(id, changeCaseStatusDto.estado);
  }

  /**
   * Eliminar caso
   * DELETE /cases/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar caso', description: 'Elimina un caso del sistema' })
  @ApiParam({ name: 'id', description: 'UUID del caso' })
  @ApiResponse({ status: 204, description: 'Caso eliminado' })
  @ApiResponse({ status: 404, description: 'Caso no encontrado' })
  async remove(@Param('id') id: string) {
    return this.casesService.remove(id);
  }
}
