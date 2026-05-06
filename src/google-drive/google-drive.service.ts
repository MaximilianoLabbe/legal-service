import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  createdTime: string;
  modifiedTime: string;
  webViewLink: string;
  parents?: string[];
}

@Injectable()
export class GoogleDriveService {
  private readonly logger = new Logger(GoogleDriveService.name);
  private drive: any;
  private auth: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    this.initializeGoogleDrive();
  }

  /**
   * Inicializa el cliente de Google Drive con autenticación por service account
   */
  private initializeGoogleDrive(): void {
    try {
      // Opción 1: Usando Service Account (recomendado para aplicaciones backend)
      const googleServiceAccountKey = this.configService.get<string>('GOOGLE_SERVICE_ACCOUNT_KEY');
      
      if (googleServiceAccountKey) {
        const keyFile = JSON.parse(googleServiceAccountKey);
        this.auth = new google.auth.GoogleAuth({
          keyFile: keyFile,
          scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });
      } else {
        // Opción 2: Usando credenciales JSON
        this.auth = new google.auth.GoogleAuth({
          keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
          scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });
      }

      this.drive = google.drive({ version: 'v3', auth: this.auth });
      this.logger.log('Google Drive inicializado correctamente');
    } catch (error) {
      this.logger.error('Error inicializando Google Drive:', error.message);
    }
  }

  /**
   * Obtiene todos los archivos de una carpeta específica
   * @param folderId - ID de la carpeta en Google Drive
   * @param pageSize - Cantidad de resultados por página
   */
  async getFilesFromFolder(folderId: string, pageSize: number = 100): Promise<GoogleDriveFile[]> {
    try {
      const files: GoogleDriveFile[] = [];
      let nextPageToken = undefined;

      do {
        const response = await this.drive.files.list({
          q: `'${folderId}' in parents and trashed = false`,
          spaces: 'drive',
          pageSize: pageSize,
          pageToken: nextPageToken,
          fields: 'nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, parents)',
        });

        if (response.data.files && response.data.files.length > 0) {
          files.push(...response.data.files);
        }

        nextPageToken = response.data.nextPageToken;
      } while (nextPageToken);

      this.logger.log(`Se obtuvieron ${files.length} archivos de la carpeta ${folderId}`);
      return files;
    } catch (error) {
      this.logger.error(`Error obteniendo archivos de la carpeta ${folderId}:`, error.message);
      throw new Error(`No se pudieron obtener los archivos: ${error.message}`);
    }
  }

  /**
   * Obtiene archivos de una carpeta con filtro de tipo MIME
   * @param folderId - ID de la carpeta en Google Drive
   * @param mimeType - Tipo MIME a filtrar (ej: 'application/pdf')
   */
  async getFilesFromFolderByType(
    folderId: string,
    mimeType: string,
  ): Promise<GoogleDriveFile[]> {
    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and mimeType = '${mimeType}' and trashed = false`,
        spaces: 'drive',
        pageSize: 1000,
        fields: 'files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink)',
      });

      this.logger.log(`Se obtuvieron ${response.data.files?.length || 0} archivos de tipo ${mimeType}`);
      return response.data.files || [];
    } catch (error) {
      this.logger.error(`Error obteniendo archivos por tipo MIME:`, error.message);
      throw new Error(`No se pudieron obtener los archivos: ${error.message}`);
    }
  }

  /**
   * Obtiene archivos recursivamente (incluyendo subcarpetas)
   * @param folderId - ID de la carpeta en Google Drive
   */
  async getFilesRecursive(folderId: string): Promise<GoogleDriveFile[]> {
    try {
      const allFiles: GoogleDriveFile[] = [];

      const getFilesRecursively = async (currentFolderId: string) => {
        const response = await this.drive.files.list({
          q: `'${currentFolderId}' in parents and trashed = false`,
          spaces: 'drive',
          pageSize: 1000,
          fields: 'files(id, name, mimeType, webViewLink)',
        });

        if (response.data.files && response.data.files.length > 0) {
          for (const file of response.data.files) {
            allFiles.push(file);

            // Si es una carpeta, buscar recursivamente
            if (file.mimeType === 'application/vnd.google-apps.folder') {
              await getFilesRecursively(file.id);
            }
          }
        }
      };

      await getFilesRecursively(folderId);
      this.logger.log(`Se obtuvieron ${allFiles.length} archivos recursivamente`);
      return allFiles;
    } catch (error) {
      this.logger.error('Error obteniendo archivos recursivamente:', error.message);
      throw new Error(`No se pudieron obtener los archivos: ${error.message}`);
    }
  }

  /**
   * Descarga el contenido de un archivo
   * @param fileId - ID del archivo en Google Drive
   */
  async downloadFile(fileId: string): Promise<Buffer> {
    try {
      const response = await this.drive.files.get(
        { fileId: fileId, alt: 'media' },
        { responseType: 'stream' },
      );

      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        response.data.on('data', (chunk: Buffer) => chunks.push(chunk));
        response.data.on('end', () => resolve(Buffer.concat(chunks)));
        response.data.on('error', (error: Error) => reject(error));
      });
    } catch (error) {
      this.logger.error(`Error descargando archivo ${fileId}:`, error.message);
      throw new Error(`No se pudo descargar el archivo: ${error.message}`);
    }
  }

  /**
   * Obtiene información detallada de un archivo
   * @param fileId - ID del archivo en Google Drive
   */
  async getFileInfo(fileId: string): Promise<any> {
    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id, name, mimeType, size, createdTime, modifiedTime, webViewLink, owners, permissions',
      });

      return response.data;
    } catch (error) {
      this.logger.error(`Error obteniendo info del archivo ${fileId}:`, error.message);
      throw new Error(`No se pudo obtener la información del archivo: ${error.message}`);
    }
  }
}
