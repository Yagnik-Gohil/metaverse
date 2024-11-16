import { DefaultStatus } from '@shared/constants/enum';
import { DefaultEntity } from '@shared/entities/default.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Asset extends DefaultEntity {
  @Column('character varying')
  base_url: string;

  @Column('character varying')
  root: string;

  @Column('character varying')
  folder: string;

  @Column('character varying')
  name: string;

  @Column({
    type: 'enum',
    enum: DefaultStatus,
    default: DefaultStatus.IN_ACTIVE,
  })
  status: DefaultStatus;
}
