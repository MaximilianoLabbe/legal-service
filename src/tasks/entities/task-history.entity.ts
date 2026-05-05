import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../../users/entities/user.entity';

@Entity('task_history')
export class TaskHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  task_id!: string;

  @Column('uuid')
  changed_by_id!: string;

  @Column('varchar', { length: 100 })
  accion!: string;

  @Column('json')
  cambios!: Record<string, any>;

  @Column('text', { nullable: true })
  comentario?: string;

  @CreateDateColumn()
  created_at!: Date;

  // Relaciones
  @ManyToOne(() => Task, (task) => task.history, { onDelete: 'CASCADE' })
  task!: Task;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  changed_by?: User;
}
