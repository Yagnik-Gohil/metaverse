import { DefaultEntity } from '@shared/entities/default.entity';
import { Column, Entity } from 'typeorm';

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

  @Column({ type: 'character varying' })
  tile_set: string;

  @Column({ type: 'character varying' })
  thumbnail: string;
}
