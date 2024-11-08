import { DefaultEntity } from '@root/src/shared/entities/default.entity';
import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { Token } from '../../token/entities/token.entity';

@Entity()
export class Admin extends DefaultEntity {
  @Column({ type: 'character varying', nullable: true })
  name: string;

  @Column({ type: 'character varying', unique: true, length: 255 })
  email: string;

  @Exclude()
  @Column({ type: 'character varying', length: 255 })
  password: string;

  @OneToMany(() => Token, (token) => token.admin)
  token: Token[];
}
