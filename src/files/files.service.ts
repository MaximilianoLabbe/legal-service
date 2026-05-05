import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { File } from './entities/file.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { CasesService } from '../cases/cases.service';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly casesService: CasesService,
  ) {
    // Asegurar que el directorio de uploads existe
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Subir un archivo a un caso
   */
  async uploadFile(
    caseId: string,
    file: Express.Multer.File,
    createFileDto: CreateFileDto,
  ): Promise<File> {
    // Verificar que el caso existe
    await this.casesService.findById(caseId);

    // Validar tipo de archivo
    const allowedMimeTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'application/x-zip-compressed',
      'application/zip',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido: ${file.mimetype}. Formatos permitidos: PDF, imágenes, documentos Word, Excel, TXT, ZIP`,
      );
    }

    // Validar tamaño (máximo 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('El archivo es demasiado grande. Máximo permitido: 50MB');
    }

    try {
      // Generar nombre único para el archivo
      const fileExtension = path.extname(file.originalname);
      const storedFileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(this.uploadDir, storedFileName);

      // Guardar archivo en disco
      fs.writeFileSync(filePath, file.buffer);

      // Extraer tipo de archivo
      const fileType = this.getFileType(file.mimetype);

      // Crear registro en base de datos
      const fileEntity = this.fileRepository.create({
        case_id: caseId,
        nombre_original: file.originalname,
        nombre_almacenado: storedFileName,
        tipo_archivo: fileType,
        mime_type: file.mimetype,
        tamaño: file.size,
        ruta: `/uploads/${storedFileName}`,
        categoría: createFileDto.category,
        descripcion: createFileDto.description,
      });

      const savedFile = await this.fileRepository.save(fileEntity);
      this.logger.log(`Archivo subido exitosamente: ${file.originalname} para caso ${caseId}`);

      return savedFile;
    } catch (error) {
      this.logger.error(`Error al subir archivo: ${error.message}`, error.stack);
      throw new BadRequestException(`Error al procesar el archivo: ${error.message}`);
    }
  }

  /**
   * Obtener todos los archivos de un caso
   */
  async getFilesByCase(caseId: string): Promise<File[]> {
    // Verificar que el caso existe
    await this.casesService.findById(caseId);

    return this.fileRepository.find({
      where: { case_id: caseId },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Obtener un archivo específico
   */
  async getFileById(fileId: string): Promise<File> {
    const file = await this.fileRepository.findOne({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException(`Archivo con ID ${fileId} no encontrado`);
    }

    return file;
  }

  /**
   * Descargar un archivo
   */
  async downloadFile(fileId: string): Promise<{ filepath: string; filename: string }> {
    const file = await this.getFileById(fileId);
    const filePath = path.join(this.uploadDir, file.nombre_almacenado);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`El archivo no existe en el servidor`);
    }

    return {
      filepath: filePath,
      filename: file.nombre_original,
    };
  }

  /**
   * Actualizar metadata de un archivo
   */
  async updateFile(fileId: string, updateFileDto: UpdateFileDto): Promise<File> {
    const file = await this.getFileById(fileId);

    if (updateFileDto.category !== undefined) {
      file.categoría = updateFileDto.category;
    }

    if (updateFileDto.description !== undefined) {
      file.descripcion = updateFileDto.description;
    }

    const updatedFile = await this.fileRepository.save(file);
    this.logger.log(`Archivo actualizado: ${fileId}`);

    return updatedFile;
  }

  /**
   * Eliminar un archivo
   */
  async deleteFile(fileId: string): Promise<void> {
    const file = await this.getFileById(fileId);
    const filePath = path.join(this.uploadDir, file.nombre_almacenado);

    try {
      // Eliminar archivo del sistema de archivos
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Eliminar registro de la base de datos
      await this.fileRepository.remove(file);
      this.logger.log(`Archivo eliminado: ${fileId}`);
    } catch (error) {
      this.logger.error(`Error al eliminar archivo: ${error.message}`, error.stack);
      throw new BadRequestException(`Error al eliminar el archivo: ${error.message}`);
    }
  }

  /**
   * Determinar el tipo de archivo basado en el MIME type
   */
  private getFileType(mimeType: string): string {
    if (mimeType.startsWith('image/')) {
      return 'imagen';
    } else if (mimeType === 'application/pdf') {
      return 'pdf';
    } else if (
      mimeType === 'application/msword' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return 'documento';
    } else if (
      mimeType === 'application/vnd.ms-excel' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return 'hoja_cálculo';
    } else if (mimeType === 'text/plain') {
      return 'texto';
    } else if (mimeType === 'application/zip' || mimeType === 'application/x-zip-compressed') {
      return 'comprimido';
    }
    return 'otro';
  }

  /**
   * Obtener estadísticas de archivos de un caso
   */
  async getFileStats(caseId: string): Promise<any> {
    const files = await this.getFilesByCase(caseId);

    const stats: any = {
      total_archivos: files.length,
      tamaño_total: files.reduce((sum, file) => sum + file.tamaño, 0),
      por_tipo: {},
      archivos: files,
    };

    files.forEach((file) => {
      stats.por_tipo[file.tipo_archivo] = (stats.por_tipo[file.tipo_archivo] || 0) + 1;
    });

    return stats;
  }
}
