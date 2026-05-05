import { IsString, IsUUID, IsNotEmpty, IsDateString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCaseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del usuario (abogado/abogada) que crea el caso (UUID v4)',
  })
  @IsUUID('4', { message: 'user_id debe ser un UUID válido' })
  @IsNotEmpty({ message: 'user_id es requerido' })
  user_id!: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del cliente (UUID v4)',
  })
  @IsUUID('4', { message: 'client_id debe ser un UUID válido' })
  @IsNotEmpty({ message: 'client_id es requerido' })
  client_id!: string;

  @ApiProperty({
    example: 'Demanda Civil',
    description: 'Tipo de caso legal (ej: Demanda Civil, Penal, Laboral, etc.)',
  })
  @IsString({ message: 'tipo debe ser un string' })
  @IsNotEmpty({ message: 'tipo es requerido' })
  tipo!: string;

  @ApiProperty({
    example: 'abierto',
    description: 'Estado actual del caso',
    enum: ['abierto', 'en_progreso', 'cerrado', 'pausado'],
    required: false,
  })
  @IsOptional()
  @IsIn(['abierto', 'en_progreso', 'cerrado', 'pausado'], { message: 'estado no válido' })
  estado?: string;

  @ApiProperty({
    example: 'Demanda por incumplimiento de contrato',
    description: 'Descripción detallada del caso',
  })
  @IsString({ message: 'descripcion debe ser un string' })
  @IsNotEmpty({ message: 'descripcion es requerida' })
  descripcion!: string;

  @ApiProperty({
    example: '2026-05-01',
    description: 'Fecha de inicio del caso (YYYY-MM-DD)',
  })
  @IsDateString({}, { message: 'fecha_inicio debe ser una fecha válida' })
  @IsNotEmpty({ message: 'fecha_inicio es requerida' })
  fecha_inicio!: string;

  @ApiProperty({
    example: '2026-12-31',
    description: 'Fecha de cierre del caso (opcional)',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'fecha_fin debe ser una fecha válida' })
  fecha_fin?: string;
}
