import { IsEmail, IsString, IsOptional, MinLength, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Email del usuario',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email debe ser válido' })
  email?: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'Nueva contraseña (mínimo 6 caracteres)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Password debe ser string' })
  @MinLength(6, { message: 'Password debe tener al menos 6 caracteres' })
  password?: string;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'FirstName debe ser un string' })
  firstName?: string;

  @ApiProperty({
    example: 'Pérez García',
    description: 'Apellidos del usuario',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'LastName debe ser un string' })
  lastName?: string;

  @ApiProperty({
    example: '+56912345678',
    description: 'Número de teléfono del usuario',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Telefono debe ser un string' })
  telefono?: string;

  @ApiProperty({
    example: 'lawyer',
    description: 'Nuevo rol del usuario',
    enum: ['admin', 'lawyer', 'user'],
    required: false,
  })
  @IsOptional()
  @IsIn(['admin', 'lawyer', 'user'], { message: 'Role debe ser: admin, lawyer o user' })
  role?: string;
}
