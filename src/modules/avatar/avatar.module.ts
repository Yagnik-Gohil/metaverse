import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { AvatarController } from './avatar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '@modules/token/entities/token.entity';
import { Avatar } from './entities/avatar.entity';
import { Asset } from '@modules/asset/entities/asset.entity';
import { User } from '@modules/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token, Avatar, Asset, User])],
  controllers: [AvatarController],
  providers: [AvatarService],
})
export class AvatarModule {}
