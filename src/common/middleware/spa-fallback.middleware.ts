import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class SpaFallbackMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SpaFallbackMiddleware.name);
  private readonly publicPath = path.join(process.cwd(), 'public');
  private readonly indexPath = path.join(this.publicPath, 'index.html');
  
  // Extensiones de archivos estáticos que se sirven directamente
  private readonly staticExtensions = [
    '.js',
    '.css',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.webp',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
    '.json',
    '.map',
  ];

  use(req: Request, res: Response, next: NextFunction) {
    const { originalUrl, path: reqPath } = req;
    const apiPrefix = process.env.API_PREFIX || 'api';

    /**
     * ORDEN DE PRIORIDAD (IMPORTANTE):
     * 1. Rutas API → Procesar como API
     * 2. Archivos estáticos → Servir directamente
     * 3. Todo lo demás → Servir index.html (SPA routing)
     */

    // ============ PRIORIDAD 1: RUTAS API ============
    if (reqPath.startsWith(`/${apiPrefix}`)) {
      this.logger.debug(`[API] ${originalUrl}`);
      return next();
    }

    // ============ PRIORIDAD 2: RUTAS ESPECIALES ============
    if (
      reqPath.startsWith('/swagger') ||
      reqPath.startsWith('/api-docs') ||
      reqPath === '/favicon.ico' ||
      reqPath === '/favicon.svg' ||
      reqPath === '/robots.txt'
    ) {
      this.logger.debug(`[STATIC] ${originalUrl}`);
      return next();
    }

    // ============ PRIORIDAD 2.5: ARCHIVOS ESTÁTICOS POR EXTENSIÓN ============
    const fileExtension = path.extname(reqPath).toLowerCase();
    if (this.staticExtensions.includes(fileExtension)) {
      this.logger.debug(`[STATIC-EXT] ${originalUrl}`);
      return next();
    }

    // ============ PRIORIDAD 2.6: ARCHIVOS QUE EXISTEN ============
    // Si el archivo existe en la carpeta public, servirlo
    try {
      const filePath = path.join(this.publicPath, reqPath.split('?')[0]);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          this.logger.debug(`[FILE-EXISTS] ${originalUrl}`);
          return next();
        }
      }
    } catch (error) {
      // Continuar si hay error al verificar el archivo
    }

    // ============ PRIORIDAD 3: SPA FALLBACK ============
    // Para todas las otras rutas, servir index.html
    try {
      if (fs.existsSync(this.indexPath)) {
        this.logger.debug(`[SPA-FALLBACK] ${originalUrl} → index.html`);
        return res.sendFile(this.indexPath);
      } else {
        this.logger.warn(`[SPA-FALLBACK] index.html no encontrado en: ${this.indexPath}`);
        return next();
      }
    } catch (error) {
      this.logger.error(`[ERROR] Sirviendo index.html: ${error.message}`);
      return next();
    }
  }
}
