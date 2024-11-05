import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { EmailService } from 'src/helpers/services/email-service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, EmailService],
})
export class AuthModule {}
