import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus, TaskPriority } from './entities/task.entity';
import { TaskHistory } from './entities/task-history.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CasesService } from '../cases/cases.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(TaskHistory)
    private readonly historyRepository: Repository<TaskHistory>,
    private readonly casesService: CasesService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Crear una nueva tarea
   */
  async createTask(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    try {
      // Verificar que el caso existe
      await this.casesService.findById(createTaskDto.case_id);

      // Verificar que el usuario creador existe
      await this.usersService.findById(userId);

      // Verificar que el usuario asignado existe (si se proporcionó)
      if (createTaskDto.assigned_to_id) {
        await this.usersService.findById(createTaskDto.assigned_to_id);
      }

      const task = this.taskRepository.create({
        case_id: createTaskDto.case_id,
        titulo: createTaskDto.titulo,
        descripcion: createTaskDto.descripcion || '',
        created_by_id: userId,
        assigned_to_id: createTaskDto.assigned_to_id,
        prioridad: createTaskDto.prioridad || 'medium',
        fecha_vencimiento: createTaskDto.fecha_vencimiento
          ? new Date(createTaskDto.fecha_vencimiento)
          : undefined,
      } as any);

      const savedTask = (await this.taskRepository.save(task)) as unknown as Task;

      // Registrar en historial
      await this.recordChange(
        savedTask.id,
        userId,
        'created',
        { titulo: savedTask.titulo, estado: savedTask.estado },
        'Tarea creada',
      );

      this.logger.log(`Tarea creada: ${savedTask.id}`);
      return this.getTaskById(savedTask.id);
    } catch (error) {
      this.logger.error(`Error al crear tarea: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener todas las tareas
   */
  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find({
      relations: ['case', 'created_by', 'assigned_to'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Obtener todas las tareas de un caso
   */
  async getTasksByCase(caseId: string): Promise<Task[]> {
    // Verificar que el caso existe
    await this.casesService.findById(caseId);

    return this.taskRepository.find({
      where: { case_id: caseId },
      relations: ['created_by', 'assigned_to'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Obtener tareas asignadas a un usuario
   */
  async getTasksAssignedToUser(userId: string): Promise<Task[]> {
    // Verificar que el usuario existe
    await this.usersService.findById(userId);

    return this.taskRepository.find({
      where: { assigned_to_id: userId },
      relations: ['case', 'created_by', 'assigned_to'],
      order: { prioridad: 'DESC', created_at: 'DESC' },
    });
  }

  /**
   * Obtener una tarea específica
   */
  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['case', 'created_by', 'assigned_to', 'history'],
    });

    if (!task) {
      throw new NotFoundException(`Tarea con ID ${taskId} no encontrada`);
    }

    return task;
  }

  /**
   * Actualizar una tarea
   */
  async updateTask(taskId: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    try {
      const task = await this.getTaskById(taskId);

      // Registrar cambios
      const cambios: Record<string, any> = {};
      let hayCambios = false;

      if (updateTaskDto.titulo && updateTaskDto.titulo !== task.titulo) {
        cambios['titulo'] = { anterior: task.titulo, nuevo: updateTaskDto.titulo };
        task.titulo = updateTaskDto.titulo;
        hayCambios = true;
      }

      if (updateTaskDto.descripcion !== undefined) {
        cambios['descripcion'] = { anterior: task.descripcion, nuevo: updateTaskDto.descripcion };
        task.descripcion = updateTaskDto.descripcion;
        hayCambios = true;
      }

      if (updateTaskDto.estado && updateTaskDto.estado !== task.estado) {
        cambios['estado'] = { anterior: task.estado, nuevo: updateTaskDto.estado };
        task.estado = updateTaskDto.estado;

        // Si se marca como completado, registrar fecha
        if (updateTaskDto.estado === TaskStatus.COMPLETED) {
          task.fecha_completado = new Date();
        }
        hayCambios = true;
      }

      if (updateTaskDto.prioridad && updateTaskDto.prioridad !== task.prioridad) {
        cambios['prioridad'] = { anterior: task.prioridad, nuevo: updateTaskDto.prioridad };
        task.prioridad = updateTaskDto.prioridad;
        hayCambios = true;
      }

      if (updateTaskDto.assigned_to_id !== undefined) {
        if (updateTaskDto.assigned_to_id) {
          await this.usersService.findById(updateTaskDto.assigned_to_id);
        }
        cambios['assigned_to_id'] = {
          anterior: task.assigned_to_id,
          nuevo: updateTaskDto.assigned_to_id,
        };
        task.assigned_to_id = updateTaskDto.assigned_to_id;
        hayCambios = true;
      }

      if (
        updateTaskDto.porcentaje_completado !== undefined &&
        updateTaskDto.porcentaje_completado !== task.porcentaje_completado
      ) {
        cambios['porcentaje_completado'] = {
          anterior: task.porcentaje_completado,
          nuevo: updateTaskDto.porcentaje_completado,
        };
        task.porcentaje_completado = updateTaskDto.porcentaje_completado;
        hayCambios = true;
      }

      if (updateTaskDto.fecha_vencimiento !== undefined) {
        const newDate = updateTaskDto.fecha_vencimiento ? new Date(updateTaskDto.fecha_vencimiento) : undefined;
        cambios['fecha_vencimiento'] = {
          anterior: task.fecha_vencimiento,
          nuevo: newDate,
        };
        task.fecha_vencimiento = newDate;
        hayCambios = true;
      }

      if (hayCambios) {
        await this.taskRepository.save(task);

        // Registrar cambios en historial
        await this.recordChange(taskId, userId, 'updated', cambios, 'Tarea actualizada');

        this.logger.log(`Tarea actualizada: ${taskId}`);
        return this.getTaskById(taskId);
      }

      return task;
    } catch (error) {
      this.logger.error(`Error al actualizar tarea: ${error.message}`);
      throw error;
    }
  }

  /**
   * Eliminar una tarea
   */
  async deleteTask(taskId: string, userId: string): Promise<void> {
    try {
      const task = await this.getTaskById(taskId);

      // Registrar eliminación en historial
      await this.recordChange(taskId, userId, 'deleted', { titulo: task.titulo }, 'Tarea eliminada');

      await this.taskRepository.remove(task);

      this.logger.log(`Tarea eliminada: ${taskId}`);
    } catch (error) {
      this.logger.error(`Error al eliminar tarea: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener historial de cambios de una tarea
   */
  async getTaskHistory(taskId: string): Promise<TaskHistory[]> {
    await this.getTaskById(taskId);

    return this.historyRepository.find({
      where: { task_id: taskId },
      relations: ['changed_by'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Registrar cambios en el historial
   */
  private async recordChange(
    taskId: string,
    userId: string,
    accion: string,
    cambios: Record<string, any>,
    comentario?: string,
  ): Promise<void> {
    try {
      const history = this.historyRepository.create({
        task_id: taskId,
        changed_by_id: userId,
        accion,
        cambios,
        comentario,
      });

      await this.historyRepository.save(history);
    } catch (error) {
      this.logger.warn(`Error al registrar cambio en historial: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de tareas
   */
  async getTaskStats(caseId: string): Promise<any> {
    const tasks = await this.getTasksByCase(caseId);

    const stats = {
      total: tasks.length,
      por_estado: {
        [TaskStatus.PENDING]: 0,
        [TaskStatus.IN_PROGRESS]: 0,
        [TaskStatus.COMPLETED]: 0,
        [TaskStatus.CANCELLED]: 0,
      },
      por_prioridad: {
        [TaskPriority.LOW]: 0,
        [TaskPriority.MEDIUM]: 0,
        [TaskPriority.HIGH]: 0,
        [TaskPriority.URGENT]: 0,
      },
      por_usuario: {} as Record<string, number>,
      porcentaje_promedio: 0,
    };

    let sumaPorcentaje = 0;

    tasks.forEach((task) => {
      stats.por_estado[task.estado]++;
      stats.por_prioridad[task.prioridad]++;

      if (task.assigned_to_id) {
        stats.por_usuario[task.assigned_to?.id || 'sin_asignar'] =
          (stats.por_usuario[task.assigned_to?.id || 'sin_asignar'] || 0) + 1;
      }

      sumaPorcentaje += task.porcentaje_completado;
    });

    if (tasks.length > 0) {
      stats.porcentaje_promedio = Math.round(sumaPorcentaje / tasks.length);
    }

    return stats;
  }
}
