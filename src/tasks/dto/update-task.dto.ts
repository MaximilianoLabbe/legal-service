import { IsString, IsOptional, IsEnum, IsInt, Min, Max, IsISO8601, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto {
  @ApiProperty({
    example: 'Revisar contrato de cliente (ACTUALIZADO)',
    description: 'Título de la tarea',
    required: false,
  })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiProperty({
    example: 'Descripción actualizada de la tarea',
    description: 'Descripción detallada',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    example: 'in_progress',
    description: 'Estado de la tarea',
    enum: TaskStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  estado?: TaskStatus;

  @ApiProperty({
    example: 'urgent',
    description: 'Prioridad de la tarea',
    enum: TaskPriority,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  prioridad?: TaskPriority;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p',
    description: 'UUID del usuario a quien asignar la tarea',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  assigned_to_id?: string;

  @ApiProperty({
    example: 75,
    description: 'Porcentaje de completitud (0-100)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  porcentaje_completado?: number;

  @ApiProperty({
    example: '2024-05-20T18:00:00Z',
    description: 'Fecha de vencimiento (ISO 8601)',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  fecha_vencimiento?: string;
}
