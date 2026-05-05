import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Case } from '../../cases/entities/case.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  case_id!: string;

  @Column({ type: 'varchar', length: 255 })
  nombre_original!: string;

  @Column({ type: 'varchar', length: 255 })
  nombre_almacenado!: string;

  @Column({ type: 'varchar', length: 100 })
  tipo_archivo!: string;

  @Column({ type: 'varchar', length: 50 })
  mime_type!: string;

  @Column({ type: 'bigint' })
  tamaño!: number;

  @Column({ type: 'text' })
  ruta!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  categoría?: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Case, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'case_id' })
  case!: Case;
}
