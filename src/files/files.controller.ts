import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

import { Response } from 'express';

@Controller('archivos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * Subir archivo a un caso
   * POST /archivos/:caseId/subir
   */
  @Post(':caseId/subir')
  @ApiOperation({
    summary: 'Subir archivo a un caso',
    description: 'Carga un nuevo archivo asociado a un caso legal. Soporta documentos, imágenes, hojas de cálculo y más.',
  })
  @ApiParam({
    name: 'caseId',
    description: 'UUID del caso'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo a subir (máximo 50MB)',
        },
        category: {
          type: 'string',
          description: 'Categoría del archivo (opcional)',
        },
        description: {
          type: 'string',
          description: 'Descripción adicional (opcional)',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Archivo subido exitosamente',
    schema: {
      example: {
        id: 'a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p',
        case_id: '550e8400-e29b-41d4-a716-446655440000',
        nombre_original: 'documento_legal.pdf',
        nombre_almacenado: 'a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p_documento_legal.pdf',
        tipo_archivo: 'pdf',
        mime_type: 'application/pdf',
        tamaño: 2048576,
        ruta: '/uploads/a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p_documento_legal.pdf',
        categoría: 'evidencia',
        descripcion: 'Documento importante del caso',
        created_at: '2024-05-03T18:30:00.000Z',
        updated_at: '2024-05-03T18:30:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'El archivo excede el tamaño máximo o tipo no permitido',
  })
  @ApiResponse({
    status: 404,
    description: 'Caso no encontrado',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('caseId', new ParseUUIDPipe()) caseId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDto: CreateFileDto,
  ) {
    if (!file) {
      throw new Error('No file provided');
    }
    return this.filesService.uploadFile(caseId, file, createFileDto);
  }

  /**
   * Obtener todos los archivos de un caso
   * GET /archivos/caso/:caseId
   */
  @Get('caso/:caseId')
  @ApiOperation({
    summary: 'Listar archivos de un caso',
    description: 'Obtiene la lista de todos los archivos asociados a un caso legal con soporte para paginación y filtros.',
  })
  @ApiParam({
    name: 'caseId',
    description: 'UUID del caso',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de archivos obtenida exitosamente',
    schema: {
      example: {
        data: [
          {
            id: 'a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p',
            case_id: '550e8400-e29b-41d4-a716-446655440000',
            nombre_original: 'documento_legal.pdf',
            tipo_archivo: 'pdf',
            tamaño: 2048576,
            categoría: 'evidencia',
            created_at: '2024-05-03T18:30:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      },
    },
  })
  async getFilesByCase(@Param('caseId', new ParseUUIDPipe()) caseId: string) {
    return this.filesService.getFilesByCase(caseId);
  }

  /**
   * Obtener estadísticas de archivos de un caso
   * GET /archivos/caso/:caseId/estadísticas
   */
  @Get('caso/:caseId/estadísticas')
  @ApiOperation({
    summary: 'Obtener estadísticas de archivos',
    description: 'Retorna estadísticas agregadas sobre los archivos de un caso: total, tamaño, desglose por tipo y categoría.',
  })
  @ApiParam({
    name: 'caseId',
    description: 'UUID del caso',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
    schema: {
      example: {
        total_archivos: 5,
        tamaño_total: 5242880,
        tamaño_total_legible: '5.00 MB',
        por_tipo: {
          pdf: 2,
          docx: 1,
          xlsx: 1,
          jpg: 1,
        },
        por_categoría: {
          evidencia: 2,
          contrato: 1,
          correspondencia: 1,
          otro: 1,
        },
        archivo_más_grande: {
          nombre: 'video_declaracion.mp4',
          tamaño: 2097152,
          tipo: 'mp4',
        },
      },
    },
  })
  async getFileStats(@Param('caseId', new ParseUUIDPipe()) caseId: string) {
    return this.filesService.getFileStats(caseId);
  }

  /**
   * Obtener detalles de un archivo específico
   * GET /archivos/:fileId
   */
  @Get(':fileId')
  @ApiOperation({
    summary: 'Obtener detalles del archivo',
    description: 'Retorna información completa de un archivo específico.',
  })
  @ApiParam({
    name: 'fileId',
    description: 'UUID del archivo',
    example: 'a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del archivo obtenidos',
    schema: {
      example: {
        id: 'a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p',
        case_id: '550e8400-e29b-41d4-a716-446655440000',
        nombre_original: 'documento_legal.pdf',
        tipo_archivo: 'pdf',
        mime_type: 'application/pdf',
        tamaño: 2048576,
        ruta: '/uploads/a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p_documento_legal.pdf',
        categoría: 'evidencia',
        descripcion: 'Documento importante del caso',
        created_at: '2024-05-03T18:30:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Archivo no encontrado',
  })
  async getFileById(@Param('fileId', new ParseUUIDPipe()) fileId: string) {
    return this.filesService.getFileById(fileId);
  }

  /**
   * Descargar un archivo
   * GET /archivos/:fileId/descargar
   */
  @Get(':fileId/descargar')
  @ApiOperation({
    summary: 'Descargar archivo',
    description: 'Descarga un archivo específico con su nombre original.',
  })
  @ApiParam({
    name: 'fileId',
    description: 'UUID del archivo',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo descargado exitosamente (binario)',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Archivo no encontrado',
  })
  async downloadFile(
    @Param('fileId', new ParseUUIDPipe()) fileId: string,
    @Res() res: Response,
  ) {
    const { filepath, filename } = await this.filesService.downloadFile(fileId);

    res.download(filepath, filename, (err) => {
      if (err) {
        res.status(500).send({ message: 'Error al descargar el archivo' });
      }
    });
  }

  /**
   * Actualizar metadata de un archivo
   * PATCH /archivos/:fileId
   */
  @Patch(':fileId')
  @ApiOperation({
    summary: 'Actualizar metadata del archivo',
    description: 'Actualiza la categoría y/o descripción de un archivo sin modificar el archivo en sí.',
  })
  @ApiParam({
    name: 'fileId',
    description: 'UUID del archivo',
    example: 'a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p',
  })
  @ApiBody({
    type: UpdateFileDto,
    examples: {
      example1: {
        summary: 'Actualizar categoría',
        value: {
          category: 'sentencia',
        },
      },
      example2: {
        summary: 'Actualizar descripción',
        value: {
          description: 'Documento revisado y aprobado',
        },
      },
      example3: {
        summary: 'Actualizar ambos campos',
        value: {
          category: 'dictamen',
          description: 'Dictamen pericial de experto',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo actualizado exitosamente',
    schema: {
      example: {
        id: 'a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p',
        case_id: '550e8400-e29b-41d4-a716-446655440000',
        nombre_original: 'documento_legal.pdf',
        categoría: 'sentencia',
        descripcion: 'Sentencia final del juzgado',
        updated_at: '2024-05-03T19:45:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Archivo no encontrado',
  })
  async updateFile(
    @Param('fileId', new ParseUUIDPipe()) fileId: string,
    @Body() updateFileDto: UpdateFileDto,
  ) {
    return this.filesService.updateFile(fileId, updateFileDto);
  }

  /**
   * Eliminar un archivo
   * DELETE /archivos/:fileId
   */
  @Delete(':fileId')
  @ApiOperation({
    summary: 'Eliminar archivo',
    description: 'Elimina un archivo específico. El archivo se elimina de la base de datos y del sistema de archivos.',
  })
  @ApiParam({
    name: 'fileId',
    description: 'UUID del archivo',
    example: 'a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p',
  })
  @ApiResponse({
    status: 204,
    description: 'Archivo eliminado exitosamente (sin contenido)',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo eliminado exitosamente',
    schema: {
      example: {
        message: 'Archivo eliminado exitosamente',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Archivo no encontrado',
  })
  async deleteFile(@Param('fileId', new ParseUUIDPipe()) fileId: string) {
    await this.filesService.deleteFile(fileId);
    return { message: 'Archivo eliminado exitosamente' };
  }
}
