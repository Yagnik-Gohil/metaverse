import { Asset } from '@modules/asset/entities/asset.entity';
import { User } from '@modules/user/entities/user.entity';
import { DefaultEntity } from '@shared/entities/default.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Avatar extends DefaultEntity {
  @Column({ type: 'integer' })
  tile_size: number;

  @OneToOne(() => Asset)
  @JoinColumn({ name: 'image_id' })
  image: Asset;

  @OneToMany(() => User, (user) => user.avatar)
  user: User[];
}
