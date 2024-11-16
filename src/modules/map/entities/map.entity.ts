import { Asset } from '@modules/asset/entities/asset.entity';
import { DefaultEntity } from '@shared/entities/default.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Map extends DefaultEntity {
  @Column({ type: 'integer' })
  row: number;

  @Column({ type: 'integer' })
  column: number;

  @Column({ type: 'integer' })
  tile_size: number;

  @Column({ type: 'jsonb' })
  layers: number[][];

  @Column({ type: 'integer', array: true })
  solid_tile: number[];

  @OneToOne(() => Asset)
  @JoinColumn({ name: 'tile_set_id' })
  tile_set: Asset;

  @OneToOne(() => Asset)
  @JoinColumn({ name: 'thumbnail_id' })
  thumbnail: Asset;
}
