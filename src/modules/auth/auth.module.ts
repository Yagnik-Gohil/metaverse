import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Token } from '../token/entities/token.entity';
import { Otp } from '../otp/entities/otp.entity';
import { Admin } from '../admin/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token, Otp, Admin])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
