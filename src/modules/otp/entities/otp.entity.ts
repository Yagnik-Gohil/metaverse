import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from '@root/src/shared/entities/default.entity';
import { User } from '../../user/entities/user.entity';
import { OtpType } from '@root/src/shared/constants/enum';

@Entity()
export class Otp extends DefaultEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'integer' })
  otp: number;

  @Column({ type: 'character varying' })
  email: string;

  @Column({ type: 'enum', enum: OtpType })
  type: string;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'integer' })
  expire_at: number;
}
