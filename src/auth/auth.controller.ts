import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService, ILoginResponse, IRefreshResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Login endpoint
   * POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login de usuario', description: 'Autentica un usuario con email y contraseña' })
  @ApiBody({ type: LoginDto, description: 'Credenciales del usuario' })
  @ApiResponse({ status: 200, description: 'Login exitoso, retorna accessToken, refreshToken y datos del usuario', schema: { example: { accessToken: 'jwt-token', refreshToken: 'refresh-token', user: { id: 'uuid', email: 'user@example.com', role: 'admin' } } } })
  @ApiResponse({ status: 400, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<ILoginResponse> {
    return this.authService.login(loginDto);
  }

  /**
   * Refresh Access Token endpoint
   * POST /auth/refresh
   * Renueva el accessToken usando el refreshToken
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar Access Token', description: 'Renueva el accessToken después de expirar (expira en 15 min). Envía el refreshToken en el body.' })
  @ApiBody({ schema: { type: 'object', properties: { refreshToken: { type: 'string', description: 'Refresh token obtenido en el login' } } } })
  @ApiResponse({ status: 200, description: 'Token renovado exitosamente', schema: { example: { accessToken: 'new-jwt-token' } } })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado' })
  async refresh(@Body('refreshToken') refreshToken: string): Promise<IRefreshResponse> {
    return this.authService.refresh(refreshToken);
  }
}

