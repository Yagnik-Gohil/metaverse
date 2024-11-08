import { DefaultEntity } from '@root/src/shared/entities/default.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Admin } from '../../admin/entities/admin.entity';

@Entity()
export class Token extends DefaultEntity {
  @Column({ type: 'text' })
  jwt: string;

  @Column({ type: 'character varying', nullable: true })
  ip: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  login_time: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  logout_time: string;

  @Column({ type: 'character varying', nullable: true })
  device_id: string;

  @ManyToOne(() => User, (user) => user.token, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Admin, (admin) => admin.token, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;
}
