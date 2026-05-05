import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty({
    example: 'evidencia',
    description: 'Categoría del archivo',
    enum: ['evidencia', 'contrato', 'correspondencia', 'dictamen', 'sentencia', 'otro'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiProperty({
    example: 'Documento importante del caso',
    description: 'Descripción adicional del archivo',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
