import { Injectable, BadRequestException, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

export interface ITokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface IRefreshResponse {
  accessToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Validar credenciales del usuario
   * @param email - Email del usuario
   * @param password - Contraseña en texto plano
   */
  async validateUser(email: string, password: string) {
    this.logger.debug(`Validating user: ${email}`);
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      this.logger.warn(`User not found: ${email}`);
      throw new BadRequestException('Credenciales inválidas');
    }

    if (!user.password) {
      this.logger.error(`User password not set: ${email}`);
      throw new BadRequestException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user: ${email}`);
      throw new BadRequestException('Credenciales inválidas');
    }

    this.logger.log(`User validated successfully: ${email}`);
    return user;
  }

  /**
   * Login del usuario y generación de JWT y Refresh Token
   * @param loginDto - Datos de login (email y password)
   */
  async login(loginDto: LoginDto): Promise<ILoginResponse> {
    const { email, password } = loginDto;

    const user = await this.validateUser(email, password);

    const payload: ITokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') || '7d',
    } as any);

    this.logger.log(`User logged in: ${email}`);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Renovar Access Token usando Refresh Token
   * @param refreshToken - Refresh token válido
   */
  async refresh(refreshToken: string): Promise<IRefreshResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      
      const newPayload: ITokenPayload = {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      const newAccessToken = this.jwtService.sign(newPayload);

      this.logger.log(`Token refreshed for user: ${payload.email}`);

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Invalid refresh token: ${message}`);
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  /**
   * Validar JWT token
   * @param token - JWT token
   */
  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Invalid token: ${message}`);
      throw new BadRequestException('Token inválido');
    }
  }

  /**
   * Hashear contraseña
   * @param password - Contraseña en texto plano
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
