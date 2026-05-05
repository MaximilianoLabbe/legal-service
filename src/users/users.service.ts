import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Crear un nuevo usuario
   * @param createUserDto - Datos del usuario a crear
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, firstName, lastName, telefono, role } = createUserDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException(`El usuario con email ${email} ya existe`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      telefono,
      role: role || 'user',
    });

    const savedUser = await this.userRepository.save(user);
    this.logger.log(`User created: ${firstName} ${lastName} (${email})`);

    // Retornar sin la contraseña
    return this.findById(savedUser.id);
  }

  /**
   * Obtener usuario por ID
   * @param id - ID del usuario
   */
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'telefono', 'role', 'created_at', 'updated_at'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  /**
   * Buscar usuario por email (incluye contraseña para autenticación)
   * @param email - Email del usuario
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Obtener todos los usuarios
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'telefono', 'role', 'created_at', 'updated_at'],
    });
  }

  /**
   * Actualizar usuario
   * @param id - ID del usuario
   * @param updateUserDto - Datos a actualizar
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException(`El email ${updateUserDto.email} ya está en uso`);
      }
      user.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.firstName) {
      user.firstName = updateUserDto.firstName;
    }

    if (updateUserDto.lastName) {
      user.lastName = updateUserDto.lastName;
    }

    if (updateUserDto.telefono) {
      user.telefono = updateUserDto.telefono;
    }

    if (updateUserDto.role) {
      user.role = updateUserDto.role;
    }

    await this.userRepository.save(user);
    this.logger.log(`User updated: ${id}`);

    return this.findById(id);
  }

  /**
   * Eliminar usuario
   * @param id - ID del usuario
   */
  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await this.userRepository.remove(user);
    this.logger.log(`User deleted: ${id}`);
  }
}
