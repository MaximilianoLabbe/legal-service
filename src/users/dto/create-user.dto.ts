import { IsEmail, IsString, IsOptional, MinLength, IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Email del usuario (único)',
  })
  @IsEmail({}, { message: 'Email debe ser válido' })
  email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
  })
  @IsString({ message: 'Password debe ser string' })
  @MinLength(6, { message: 'Password debe tener al menos 6 caracteres' })
  password!: string;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
  })
  @IsString({ message: 'FirstName debe ser un string' })
  @IsNotEmpty({ message: 'FirstName es requerido' })
  firstName!: string;

  @ApiProperty({
    example: 'Pérez García',
    description: 'Apellidos del usuario',
  })
  @IsString({ message: 'LastName debe ser un string' })
  @IsNotEmpty({ message: 'LastName es requerido' })
  lastName!: string;

  @ApiProperty({
    example: '+56912345678',
    description: 'Número de teléfono del usuario',
  })
  @IsString({ message: 'Telefono debe ser un string' })
  @IsNotEmpty({ message: 'Telefono es requerido' })
  telefono!: string;

  @ApiProperty({
    example: 'admin',
    description: 'Rol del usuario (admin, lawyer o user)',
    enum: ['admin', 'lawyer', 'user'],
    required: false,
  })
  @IsOptional()
  @IsIn(['admin', 'lawyer', 'user'], { message: 'Role debe ser: admin, lawyer o user' })
  role?: string;
}
