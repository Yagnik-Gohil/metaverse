import { Injectable } from '@nestjs/common';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Map } from './entities/map.entity';
import { FindManyOptions, In, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Asset } from '@modules/asset/entities/asset.entity';
import { DefaultStatus } from '@shared/constants/enum';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(Map)
    private readonly mapRepository: Repository<Map>,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}
  async create(createMapDto: CreateMapDto) {
    const { tile_set, thumbnail, ...map } = createMapDto;

    const data = await this.mapRepository.save({
      ...map,
      tile_set: { id: tile_set },
      thumbnail: { id: thumbnail },
    });

    if (data.id) {
      await this.assetRepository.update(
        {
          id: In([tile_set, thumbnail]),
        },
        { status: DefaultStatus.ACTIVE },
      );
    }
    return plainToInstance(Map, data);
  }

  async findAll(where: FindManyOptions<Map>): Promise<[Map[], number]> {
    const [list, count] = await this.mapRepository.findAndCount(where);
    return [plainToInstance(Map, list), count];
  }

  async findOne(id: string) {
    const result = await this.mapRepository.findOne({
      where: { id },
      relations: {
        thumbnail: true,
        tile_set: true,
      },
    });
    return plainToInstance(Map, result);
  }

  async update(id: string, updateMapDto: UpdateMapDto) {
    const { tile_set, thumbnail, ...map } = updateMapDto;
    const result = await this.mapRepository.update(id, {
      ...map,
      tile_set: { id: tile_set },
      thumbnail: { id: thumbnail },
    });
    return result;
  }

  async remove(id: string) {
    const result = await this.mapRepository.softDelete(id);
    return result;
  }
}
