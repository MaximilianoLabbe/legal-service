import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email del usuario',
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
}
