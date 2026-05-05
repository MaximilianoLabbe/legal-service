import { IsString, IsEmail, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del usuario propietario del cliente',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'user_id debe ser un UUID válido' })
  user_id?: string;

  @ApiProperty({
    example: '12345678-K',
    description: 'RUT del cliente',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'RUT debe ser un string' })
  rut?: string;

  @ApiProperty({
    example: 'Juan Pedro Pérez',
    description: 'Nombre del cliente',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Nombre debe ser un string' })
  nombre?: string;

  @ApiProperty({
    example: '+56987654321',
    description: 'Teléfono de contacto',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Teléfono debe ser un string' })
  telefono?: string;

  @ApiProperty({
    example: 'nuevo.email@example.com',
    description: 'Email del cliente',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email debe ser válido' })
  email?: string;
}
