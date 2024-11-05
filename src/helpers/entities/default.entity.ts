import { Exclude } from 'class-transformer';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export class DefaultEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
