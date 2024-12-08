import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Avatar } from './entities/avatar.entity';
import { Repository } from 'typeorm';
import { Asset } from '@modules/asset/entities/asset.entity';
import { plainToInstance } from 'class-transformer';
import { DefaultStatus } from '@shared/constants/enum';
import { User } from '@modules/user/entities/user.entity';
import { MESSAGE } from '@shared/constants/constant';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createAvatarDto: CreateAvatarDto) {
    const { image, tile_size } = createAvatarDto;

    const data = await this.avatarRepository.save({
      tile_size,
      image: { id: image },
    });

    if (data.id) {
      await this.assetRepository.update(
        { id: image },
        { status: DefaultStatus.ACTIVE },
      );
    }
    return plainToInstance(Map, data);
  }

  async findAll(limit: number, offset: number): Promise<[Avatar[], number]> {
    const query = this.avatarRepository
      .createQueryBuilder('avatar')
      .select([
        'avatar.id AS id',
        'avatar.tile_size AS tile_size',
        'avatar.created_at AS created_at',
        'asset.base_url || asset.root || asset.folder || asset.name AS image',
        'COUNT(u.id)::INTEGER AS users',
      ])
      .innerJoin('asset', 'asset', 'asset.id = avatar.image_id')
      .leftJoin('user', 'u', 'u.avatar_id = avatar.id')
      .groupBy('avatar.id, asset.id')
      .orderBy('avatar.created_at', 'DESC');

    const list = await query.limit(limit).offset(offset).getRawMany();
    const count = await query.getCount();

    return [plainToInstance(Avatar, list), count];
  }

  async remove(id: string) {
    const count = await this.userRepository.count({
      where: { avatar: { id: id } },
    });
    if (count) {
      throw new BadRequestException(MESSAGE.USER_USING_AVATAR(count));
    }

    const result = await this.avatarRepository.softDelete(id);
    return result;
  }
}
