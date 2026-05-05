import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string; version: string } {
    return {
      message: 'Legal Management System API',
      version: '1.0.0',
    };
  }

  health(): { status: string } {
    return { status: 'ok' };
  }
}
