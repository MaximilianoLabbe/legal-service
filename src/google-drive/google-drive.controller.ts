import { Controller, Get, Param, Query, Logger } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Google Drive')
@Controller('google-drive')
export class GoogleDriveController {
  private readonly logger = new Logger(GoogleDriveController.name);

  constructor(private readonly googleDriveService: GoogleDriveService) {}

  /**
   * Obtiene todos los archivos de una carpeta
   * GET /google-drive/files/:folderId
   */
  @Get('files/:folderId')
  @ApiOperation({ summary: 'Obtener todos los archivos de una carpeta' })
  @ApiParam({ name: 'folderId', description: 'ID de la carpeta en Google Drive' })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Cantidad de resultados por página' })
  async getFiles(
    @Param('folderId') folderId: string,
    @Query('pageSize') pageSize: string = '100',
  ) {
    try {
      const files = await this.googleDriveService.getFilesFromFolder(
        folderId,
        parseInt(pageSize),
      );
      return {
        success: true,
        count: files.length,
        data: files,
      };
    } catch (error) {
      this.logger.error('Error en getFiles:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtiene archivos de un tipo específico
   * GET /google-drive/files/:folderId/type/:mimeType
   */
  @Get('files/:folderId/type/:mimeType')
  @ApiOperation({ summary: 'Obtener archivos de un tipo específico' })
  @ApiParam({ name: 'folderId', description: 'ID de la carpeta' })
  @ApiParam({ name: 'mimeType', description: 'Tipo MIME (ej: application/pdf)' })
  async getFilesByType(
    @Param('folderId') folderId: string,
    @Param('mimeType') mimeType: string,
  ) {
    try {
      const files = await this.googleDriveService.getFilesFromFolderByType(
        folderId,
        mimeType,
      );
      return {
        success: true,
        count: files.length,
        data: files,
      };
    } catch (error) {
      this.logger.error('Error en getFilesByType:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtiene archivos recursivamente (incluyendo subcarpetas)
   * GET /google-drive/files/:folderId/recursive
   */
  @Get('files/:folderId/recursive')
  @ApiOperation({ summary: 'Obtener archivos recursivamente incluyendo subcarpetas' })
  @ApiParam({ name: 'folderId', description: 'ID de la carpeta raíz' })
  async getFilesRecursive(@Param('folderId') folderId: string) {
    try {
      const files = await this.googleDriveService.getFilesRecursive(folderId);
      return {
        success: true,
        count: files.length,
        data: files,
      };
    } catch (error) {
      this.logger.error('Error en getFilesRecursive:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtiene información de un archivo específico
   * GET /google-drive/file-info/:fileId
   */
  @Get('file-info/:fileId')
  @ApiOperation({ summary: 'Obtener información detallada de un archivo' })
  @ApiParam({ name: 'fileId', description: 'ID del archivo' })
  async getFileInfo(@Param('fileId') fileId: string) {
    try {
      const info = await this.googleDriveService.getFileInfo(fileId);
      return {
        success: true,
        data: info,
      };
    } catch (error) {
      this.logger.error('Error en getFileInfo:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
