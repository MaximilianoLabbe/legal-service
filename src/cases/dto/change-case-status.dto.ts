import { IsString, IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeCaseStatusDto {
  @ApiProperty({
    example: 'cerrado',
    description: 'Nuevo estado del caso',
    enum: ['abierto', 'en_progreso', 'cerrado', 'pausado'],
  })
  @IsString({ message: 'estado debe ser un string' })
  @IsNotEmpty({ message: 'estado es requerido' })
  @IsIn(['abierto', 'en_progreso', 'cerrado', 'pausado'], { message: 'estado no válido' })
  estado!: string;
}
