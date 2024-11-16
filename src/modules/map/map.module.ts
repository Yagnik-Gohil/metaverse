import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '@modules/token/entities/token.entity';
import { Map } from './entities/map.entity';
import { Asset } from '@modules/asset/entities/asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token, Map, Asset])],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
