import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class SpaFallbackMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SpaFallbackMiddleware.name);
  private readonly publicPath = path.join(process.cwd(), 'public');
  private readonly indexPath = path.join(this.publicPath, 'index.html');

  use(req: Request, res: Response, next: NextFunction) {
    const { originalUrl } = req;
    const apiPrefix = process.env.API_PREFIX || 'api';

    // Si es una ruta de API, dejar pasar
    if (originalUrl.startsWith(`/${apiPrefix}`)) {
      return next();
    }

    // Si es Swagger o documentación, dejar pasar
    if (
      originalUrl.startsWith('/swagger') ||
      originalUrl.startsWith('/api-docs') ||
      originalUrl === '/favicon.ico'
    ) {
      return next();
    }

    // Ruta del archivo solicitado
    const filePath = path.join(this.publicPath, originalUrl.split('?')[0]);

    // Si el archivo existe (CSS, JS, imágenes, etc), dejar pasar
    try {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return next();
      }
    } catch (error) {
      // Continuar si hay error al verificar el archivo
    }

    // Para todas las otras rutas, servir index.html (SPA routing)
    try {
      if (fs.existsSync(this.indexPath)) {
        return res.sendFile(this.indexPath);
      }
    } catch (error) {
      this.logger.error(`Error sirviendo index.html: ${error.message}`);
    }

    // Si no existe index.html, continuar con el siguiente middleware
    next();
  }
}
