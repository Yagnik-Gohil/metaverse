import { Exclude } from 'class-transformer';
import { UserStatus } from 'src/helpers/constants/enum';
import { DefaultEntity } from 'src/helpers/entities/default.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class User extends DefaultEntity {
  @Column({ length: 255, nullable: true })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ unique: true, length: 255 })
  username: string;

  @Exclude()
  @Column({ length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.IN_ACTIVE,
  })
  status: UserStatus;
}
