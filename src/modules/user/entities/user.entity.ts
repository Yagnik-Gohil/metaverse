import { Exclude } from 'class-transformer';
import { UserStatus } from '@root/src/shared/constants/enum';
import { DefaultEntity } from '@root/src/shared/entities/default.entity';
import { Token } from 'src/modules/token/entities/token.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class User extends DefaultEntity {
  @Column({ type: 'character varying', nullable: true })
  name: string;

  @Column({ type: 'character varying', unique: true, length: 255 })
  email: string;

  @Exclude()
  @Column({ type: 'character varying', length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_verified: boolean;

  @OneToMany(() => Token, (token) => token.user)
  token: Token[];
}
