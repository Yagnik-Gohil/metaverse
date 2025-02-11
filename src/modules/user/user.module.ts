import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Token } from '@modules/token/entities/token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token, User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
