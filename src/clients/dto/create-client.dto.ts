import { IsString, IsEmail, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del usuario que crea el cliente',
  })
  @IsUUID('4', { message: 'user_id debe ser un UUID válido' })
  @IsNotEmpty({ message: 'user_id es requerido' })
  user_id!: string;

  @ApiProperty({
    example: '12345678-K',
    description: 'RUT del cliente (formato: XX.XXX.XXX-K)',
  })
  @IsString({ message: 'RUT debe ser un string' })
  @IsNotEmpty({ message: 'RUT es requerido' })
  rut!: string;

  @ApiProperty({
    example: 'Juan Pérez García',
    description: 'Nombre completo del cliente',
  })
  @IsString({ message: 'Nombre debe ser un string' })
  @IsNotEmpty({ message: 'Nombre es requerido' })
  nombre!: string;

  @ApiProperty({
    example: '+56912345678',
    description: 'Teléfono de contacto del cliente',
  })
  @IsString({ message: 'Teléfono debe ser un string' })
  @IsNotEmpty({ message: 'Teléfono es requerido' })
  telefono!: string;

  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Email del cliente',
  })
  @IsEmail({}, { message: 'Email debe ser válido' })
  @IsNotEmpty({ message: 'Email es requerido' })
  email!: string;
}
