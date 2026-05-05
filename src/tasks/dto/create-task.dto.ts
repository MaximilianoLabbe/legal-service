import { IsString, IsUUID, IsOptional, IsEnum, IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Revisar contrato de cliente',
    description: 'Título de la tarea',
  })
  @IsString()
  titulo!: string;

  @ApiProperty({
    example: 'Revisar todos los términos del contrato y validar cláusulas',
    description: 'Descripción detallada de la tarea',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID del caso asociado',
  })
  @IsUUID()
  case_id!: string;

  @ApiProperty({
    example: 'high',
    description: 'Prioridad de la tarea',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
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
    example: '2024-05-15T18:00:00Z',
    description: 'Fecha de vencimiento (ISO 8601)',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  fecha_vencimiento?: string;
}
