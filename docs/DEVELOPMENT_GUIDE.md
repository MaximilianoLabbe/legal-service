# Guía de Desarrollo

Guía completa para desarrolladores que trabajan con este backend.

## Estructura del Proyecto

```
src/
├── auth/                  # Módulo de autenticación
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── local-auth.guard.ts
│   └── dto/
│       └── login.dto.ts
│
├── users/                 # Módulo de usuarios
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   ├── entities/
│   │   └── user.entity.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
│
├── clients/               # Módulo de clientes
│   ├── clients.controller.ts
│   ├── clients.service.ts
│   ├── clients.module.ts
│   ├── entities/
│   │   └── client.entity.ts
│   └── dto/
│       ├── create-client.dto.ts
│       └── update-client.dto.ts
│
├── cases/                 # Módulo de casos legales
│   ├── cases.controller.ts
│   ├── cases.service.ts
│   ├── cases.module.ts
│   ├── entities/
│   │   └── case.entity.ts
│   └── dto/
│       ├── create-case.dto.ts
│       ├── update-case.dto.ts
│       └── change-case-status.dto.ts
│
├── common/                # Código compartido
│   ├── guards/
│   │   └── roles.guard.ts
│   ├── decorators/
│   │   ├── roles.decorator.ts
│   │   └── current-user.decorator.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   └── exceptions/
│       └── http-exception.filter.ts
│
├── database/              # Capa de acceso a datos
│   ├── database.module.ts
│   └── database.service.ts
│
├── config/                # Configuración
│   └── configuration.ts
│
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

## Estructura de Capas

### Controller (Controlador)
- Maneja las peticiones HTTP
- Valida parámetros de ruta y query
- Llama a servicios
- Ejemplo: `clients.controller.ts`

### Service (Servicio)
- Contiene la lógica de negocio
- Se comunica con la base de datos
- Implementa validaciones
- Ejemplo: `clients.service.ts`

### DTO (Data Transfer Object)
- Valida datos entrantes
- Define estructura de datos
- Usa class-validator para validaciones
- Ejemplo: `create-client.dto.ts`

### Entity (Entidad)
- Define la estructura de datos en la BD
- Mapea a tablas
- Ejemplo: `client.entity.ts`

## Patrones de Desarrollo

### Crear un nuevo módulo

1. **Crear estructura de carpetas**
```
src/mymodule/
├── mymodule.controller.ts
├── mymodule.service.ts
├── mymodule.module.ts
├── entities/
│   └── mymodule.entity.ts
└── dto/
    ├── create-mymodule.dto.ts
    └── update-mymodule.dto.ts
```

2. **Crear Entity**
```typescript
// mymodule.entity.ts
export class MyModule {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}
```

3. **Crear DTOs**
```typescript
// create-mymodule.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMyModuleDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

4. **Crear Service**
```typescript
// mymodule.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MyModuleService {
  private readonly logger = new Logger(MyModuleService.name);

  constructor(private databaseService: DatabaseService) {}

  async create(createDto: CreateMyModuleDto) {
    // Implementar lógica
  }
}
```

5. **Crear Controller**
```typescript
// mymodule.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MyModuleService } from './mymodule.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('mymodule')
@UseGuards(JwtAuthGuard)
export class MyModuleController {
  constructor(private readonly service: MyModuleService) {}

  @Post()
  create(@Body() createDto) {
    return this.service.create(createDto);
  }
}
```

6. **Crear Module**
```typescript
// mymodule.module.ts
import { Module } from '@nestjs/common';
import { MyModuleService } from './mymodule.service';
import { MyModuleController } from './mymodule.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MyModuleService],
  controllers: [MyModuleController],
  exports: [MyModuleService],
})
export class MyModuleModule {}
```

7. **Agregar Module a app.module.ts**
```typescript
import { MyModuleModule } from './mymodule/mymodule.module';

@Module({
  imports: [
    // ... otros imports
    MyModuleModule,
  ],
})
export class AppModule {}
```

## Seguridad

### Proteger endpoints con JWT

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get()
getData() {
  // Endpoint protegido
}
```

### Proteger endpoints con Roles

```typescript
import { UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'lawyer')
@Delete(':id')
removeClient(@Param('id') id: string) {
  // Solo admin y lawyer pueden eliminar
}
```

### Obtener usuario actual

```typescript
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user) {
  return user; // { userId, email, role }
}
```

## Base de Datos

### Queries básicas

```typescript
// SELECT
const users = await this.databaseService.query(
  'SELECT * FROM users WHERE role = @role',
  { role: 'admin' }
);

// INSERT
await this.databaseService.execute(
  'INSERT INTO users (id, email, password, role) VALUES (@id, @email, @password, @role)',
  { id: '123', email: 'user@example.com', password: 'hashed', role: 'user' }
);

// UPDATE
await this.databaseService.execute(
  'UPDATE users SET role = @role WHERE id = @id',
  { id: '123', role: 'admin' }
);

// DELETE
await this.databaseService.execute(
  'DELETE FROM users WHERE id = @id',
  { id: '123' }
);
```

## Validaciones

NestJS usa `class-validator` para validaciones:

```typescript
import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsIn(['admin', 'user'])
  role?: string;
}
```

## Manejo de Errores

```typescript
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';

// Error de validación
throw new BadRequestException('El usuario ya existe');

// Recurso no encontrado
throw new NotFoundException('Usuario no encontrado');

// Conflicto
throw new ConflictException('El email ya está en uso');
```

## Testing

Crear archivo de test:

```typescript
// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const result = await service.create({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.email).toBe('test@example.com');
  });
});
```

Ejecutar tests:
```bash
npm run test
npm run test:watch
npm run test:cov
```

## Logging

```typescript
import { Logger } from '@nestjs/common';

export class MyService {
  private readonly logger = new Logger(MyService.name);

  someMethod() {
    this.logger.log('Mensaje informativo');
    this.logger.warn('Advertencia');
    this.logger.error('Error', 'Stack trace');
    this.logger.debug('Debug (solo en desarrollo)');
  }
}
```

## Environment Variables

Variables disponibles (ver `.env`):
- `NODE_ENV` - Entorno (development/production)
- `PORT` - Puerto del servidor
- `JWT_SECRET` - Clave secreta JWT
- `JWT_EXPIRATION` - Expiración del token
- `DB_*` - Configuración de base de datos

## Build y Deployment

```bash
# Build para producción
npm run build

# Iniciar aplicación en producción
npm run start:prod

# Ver estructura de dist
tree dist/
```

## Buenas Prácticas

1. **Siempre usar DTOs para validación**
2. **Loguear eventos importantes**
3. **Manejar errores explícitamente**
4. **Usar guards para proteger endpoints**
5. **Escribir tests para servicios críticos**
6. **Documentar código complejo**
7. **Usar transacciones en operaciones múltiples**
8. **Validar parámetros en entrada**
9. **No exponer contraseñas o datos sensibles**
10. **Usar variables de entorno para configuración**

## Recursos

- [NestJS Docs](https://docs.nestjs.com)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Class Validator](https://github.com/typestack/class-validator)
- [Passport.js](http://www.passportjs.org)
- [JWT](https://jwt.io)
