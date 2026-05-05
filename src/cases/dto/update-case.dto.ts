import { IsString, IsUUID, IsOptional, IsDateString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCaseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del usuario (abogado)',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'user_id debe ser un UUID válido' })
  user_id?: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del cliente',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'client_id debe ser un UUID válido' })
  client_id?: string;

  @ApiProperty({
    example: 'Demanda Penal',
    description: 'Tipo de caso',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'tipo debe ser un string' })
  tipo?: string;

  @ApiProperty({
    example: 'en_progreso',
    description: 'Estado del caso',
    enum: ['abierto', 'en_progreso', 'cerrado', 'pausado'],
    required: false,
  })
  @IsOptional()
  @IsIn(['abierto', 'en_progreso', 'cerrado', 'pausado'], { message: 'estado no válido' })
  estado?: string;

  @ApiProperty({
    example: 'Se han presentado nuevas pruebas',
    description: 'Descripción del caso',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'descripcion debe ser un string' })
  descripcion?: string;

  @ApiProperty({
    example: '2026-05-15',
    description: 'Fecha de inicio (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'fecha_inicio debe ser una fecha válida' })
  fecha_inicio?: string;

  @ApiProperty({
    example: '2027-06-01',
    description: 'Fecha de cierre (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'fecha_fin debe ser una fecha válida' })
  fecha_fin?: string;
}
