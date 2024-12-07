import { Avatar } from '@modules/avatar/entities/avatar.entity';
import { UserStatus } from '@shared/constants/enum';
import { DefaultEntity } from '@shared/entities/default.entity';
import { Exclude } from 'class-transformer';
import { Token } from 'src/modules/token/entities/token.entity';
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

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

  @ManyToOne(() => Avatar, (avatar) => avatar.user, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'avatar_id' })
  avatar: Avatar;
}
