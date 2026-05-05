import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFileDto {
  @ApiProperty({
    example: 'sentencia',
    description: 'Nueva categoría del archivo',
    enum: ['evidencia', 'contrato', 'correspondencia', 'dictamen', 'sentencia', 'otro'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiProperty({
    example: 'Sentencia final del juzgado',
    description: 'Nueva descripción del archivo',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
