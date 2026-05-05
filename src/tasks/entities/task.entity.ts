import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Case } from '../../cases/entities/case.entity';
import { User } from '../../users/entities/user.entity';
import { TaskHistory } from './task-history.entity';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  case_id!: string;

  @Column('varchar', { length: 255 })
  titulo!: string;

  @Column('text', { nullable: true })
  descripcion?: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  estado!: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  prioridad!: TaskPriority;

  @Column('uuid')
  created_by_id!: string;

  @Column('uuid', { nullable: true })
  assigned_to_id?: string;

  @Column('timestamp', { nullable: true })
  fecha_vencimiento?: Date;

  @Column('timestamp', { nullable: true })
  fecha_completado?: Date;

  @Column('int', { default: 0 })
  porcentaje_completado!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relaciones
  @ManyToOne(() => Case, { onDelete: 'CASCADE' })
  case!: Case;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  created_by!: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  assigned_to?: User;

  @OneToMany(() => TaskHistory, (history) => history.task)
  history!: TaskHistory[];
}
