import { Injectable } from '@nestjs/common';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Map } from './entities/map.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(Map)
    private readonly mapRepository: Repository<Map>,
  ) {}
  async create(createMapDto: CreateMapDto) {
    const data = await this.mapRepository.save(createMapDto);
    return plainToInstance(Map, data);
  }

  async findAll(where: FindManyOptions<Map>): Promise<[Map[], number]> {
    const [list, count] = await this.mapRepository.findAndCount(where);
    return [plainToInstance(Map, list), count];
  }

  async findOne(id: string) {
    const result = await this.mapRepository.findOne({ where: { id } });
    return plainToInstance(Map, result);
  }

  async update(id: string, updateMapDto: UpdateMapDto) {
    const result = await this.mapRepository.update(id, updateMapDto);
    return result;
  }

  async remove(id: string) {
    const result = await this.mapRepository.softDelete(id);
    return result;
  }
}
