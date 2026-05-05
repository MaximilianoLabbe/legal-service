import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Controller('tareas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Crear una nueva tarea
   * POST /tareas
   */
  @Post()
  @ApiOperation({
    summary: 'Crear una nueva tarea',
    description: 'Crea una nueva tarea en un caso. El usuario autenticado es registrado como creador.',
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: 'Tarea creada exitosamente',
    schema: {
      example: {
        id: 'a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p',
        case_id: '550e8400-e29b-41d4-a716-446655440000',
        titulo: 'Revisar contrato de cliente',
        descripcion: 'Revisar todos los términos del contrato',
        estado: 'pending',
        prioridad: 'high',
        created_by_id: 'user-id',
        assigned_to_id: 'assigned-user-id',
        fecha_vencimiento: '2024-05-15T18:00:00Z',
        porcentaje_completado: 0,
        created_at: '2024-05-03T18:30:00.000Z',
        updated_at: '2024-05-03T18:30:00.000Z',
      },
    },
  })
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() userId: string,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, userId);
  }

  /**
   * Obtener todas las tareas
   * GET /tareas
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener todas las tareas',
    description: 'Retorna todas las tareas sin ningún filtro.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las tareas obtenida exitosamente',
    schema: {
      example: [
        {
          id: 'a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p',
          caso: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            titulo: 'Demanda civil',
          },
          titulo: 'Revisar contrato',
          estado: 'in_progress',
          prioridad: 'high',
          created_by: {
            id: 'user-id',
            nombre: 'Juan Pérez',
          },
          assigned_to: {
            id: 'user-id-2',
            nombre: 'María García',
          },
          created_at: '2024-05-03T18:30:00.000Z',
        },
      ],
    },
  })
  async getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  /**
   * Obtener todas las tareas de un caso
   * GET /tareas/caso/:caseId
   */
  @Get('caso/:caseId')
  @ApiOperation({
    summary: 'Obtener tareas de un caso',
    description: 'Retorna todas las tareas asociadas a un caso específico.',
  })
  @ApiParam({
    name: 'caseId',
    description: 'UUID del caso',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tareas obtenida exitosamente',
    schema: {
      example: {
        data: [
          {
            id: 'a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p',
            titulo: 'Revisar contrato',
            estado: 'in_progress',
            prioridad: 'high',
            assigned_to: {
              id: 'user-id',
              nombre: 'Juan Pérez',
              email: 'juan@example.com',
            },
            created_at: '2024-05-03T18:30:00.000Z',
          },
        ],
      },
    },
  })
  async getTasksByCase(
    @Param('caseId', new ParseUUIDPipe()) caseId: string,
  ): Promise<Task[]> {
    return this.tasksService.getTasksByCase(caseId);
  }

  /**
   * Obtener tareas asignadas al usuario
   * GET /tareas/mis-tareas
   */
  @Get('mis-tareas')
  @ApiOperation({
    summary: 'Obtener mis tareas asignadas',
    description: 'Retorna todas las tareas asignadas al usuario autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tareas asignadas',
  })
  async getMyTasks(@CurrentUser() userId: string): Promise<Task[]> {
    return this.tasksService.getTasksAssignedToUser(userId);
  }

  /**
   * Obtener tareas de un usuario específico
   * GET /tareas/usuario/:userId
   */
  @Get('usuario/:userId')
  @ApiOperation({
    summary: 'Obtener tareas de un usuario',
    description: 'Retorna todas las tareas asignadas a un usuario específico.',
  })
  @ApiParam({
    name: 'userId',
    description: 'UUID del usuario',
  })
  async getTasksByUser(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<Task[]> {
    return this.tasksService.getTasksAssignedToUser(userId);
  }

  /**
   * Obtener estadísticas de tareas
   * GET /tareas/caso/:caseId/estadísticas
   */
  @Get('caso/:caseId/estadísticas')
  @ApiOperation({
    summary: 'Obtener estadísticas de tareas',
    description: 'Retorna estadísticas sobre las tareas de un caso.',
  })
  @ApiParam({
    name: 'caseId',
    description: 'UUID del caso',
  })
  async getTaskStats(
    @Param('caseId', new ParseUUIDPipe()) caseId: string,
  ): Promise<any> {
    return this.tasksService.getTaskStats(caseId);
  }

  /**
   * Obtener detalle de una tarea
   * GET /tareas/:taskId
   */
  @Get(':taskId')
  @ApiOperation({
    summary: 'Obtener detalle de una tarea',
    description: 'Retorna la información completa de una tarea incluyendo su historial.',
  })
  @ApiParam({
    name: 'taskId',
    description: 'UUID de la tarea',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle de la tarea',
  })
  @ApiResponse({
    status: 404,
    description: 'Tarea no encontrada',
  })
  async getTaskById(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
  ): Promise<Task> {
    return this.tasksService.getTaskById(taskId);
  }

  /**
   * Obtener historial de cambios de una tarea
   * GET /tareas/:taskId/historial
   */
  @Get(':taskId/historial')
  @ApiOperation({
    summary: 'Obtener historial de cambios',
    description: 'Retorna el historial completo de cambios de una tarea.',
  })
  @ApiParam({
    name: 'taskId',
    description: 'UUID de la tarea',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial de cambios',
    schema: {
      example: {
        data: [
          {
            id: 'history-id',
            accion: 'updated',
            cambios: {
              estado: { anterior: 'pending', nuevo: 'in_progress' },
            },
            changed_by: { id: 'user-id', nombre: 'Juan' },
            created_at: '2024-05-03T19:30:00.000Z',
          },
        ],
      },
    },
  })
  async getTaskHistory(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
  ): Promise<any> {
    return { data: await this.tasksService.getTaskHistory(taskId) };
  }

  /**
   * Actualizar una tarea
   * PUT /tareas/:taskId
   */
  @Put(':taskId')
  @ApiOperation({
    summary: 'Actualizar una tarea',
    description: 'Actualiza los campos de una tarea. Los cambios son registrados en el historial.',
  })
  @ApiParam({
    name: 'taskId',
    description: 'UUID de la tarea',
  })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Tarea actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tarea no encontrada',
  })
  async updateTask(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() userId: string,
  ): Promise<Task> {
    return this.tasksService.updateTask(taskId, updateTaskDto, userId);
  }

  /**
   * Eliminar una tarea
   * DELETE /tareas/:taskId
   */
  @Delete(':taskId')
  @ApiOperation({
    summary: 'Eliminar una tarea',
    description: 'Elimina una tarea del sistema. La eliminación es registrada en el historial.',
  })
  @ApiParam({
    name: 'taskId',
    description: 'UUID de la tarea',
  })
  @ApiResponse({
    status: 200,
    description: 'Tarea eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tarea no encontrada',
  })
  async deleteTask(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @CurrentUser() userId: string,
  ): Promise<{ message: string }> {
    await this.tasksService.deleteTask(taskId, userId);
    return { message: 'Tarea eliminada exitosamente' };
  }
}
