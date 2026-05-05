/**
 * Tipos e Interfaces Comunes
 * 
 * Exportaciones de tipos compartidos del proyecto.
 */

export interface IUser {
  id: string;
  email: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface IClient {
  id: string;
  rut: string;
  nombre: string;
  telefono: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export interface ICase {
  id: string;
  client_id: string;
  tipo: string;
  estado: string;
  descripcion: string;
  fecha_inicio: Date;
  fecha_fin?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ILoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
  statusCode?: number;
  path?: string;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export type CaseStatus = 'abierto' | 'en_progreso' | 'cerrado' | 'pausado';
export type UserRole = 'admin' | 'lawyer' | 'user';
export type QueryParams = Record<string, string | string[]>;
