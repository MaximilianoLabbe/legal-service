import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleDriveOAuthService {
  private readonly logger = new Logger(GoogleDriveOAuthService.name);
  private drive: any;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Inicializa Google Drive con un token de acceso OAuth2
   */
  initializeWithAccessToken(accessToken: string): void {
    const auth = new google.auth.OAuth2(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
    );
    auth.setCredentials({ access_token: accessToken });
    this.drive = google.drive({ version: 'v3', auth });
    this.logger.log('Google Drive inicializado con OAuth2');
  }

  /**
   * Obtiene archivos de una carpeta
   */
  async getFilesFromFolder(folderId: string): Promise<any[]> {
    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        pageSize: 1000,
        fields: 'files(id, name, mimeType, size, createdTime, webViewLink)',
      });
      return response.data.files || [];
    } catch (error) {
      this.logger.error('Error obteniendo archivos:', error.message);
      throw error;
    }
  }
}
