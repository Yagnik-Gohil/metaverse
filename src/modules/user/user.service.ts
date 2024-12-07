import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(where: FindManyOptions<User>): Promise<[User[], number]> {
    const [list, count] = await this.userRepository.findAndCount(where);
    return [plainToInstance(User, list), count];
  }

  async findOne(id: string) {
    const result = await this.userRepository.findOne({
      where: { id },
      relations: { avatar: { image: true } },
    });
    return plainToInstance(User, result);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { name, avatar } = updateUserDto;
    const result = await this.userRepository.update(id, {
      name,
      avatar: { id: avatar },
    });
    return result;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
