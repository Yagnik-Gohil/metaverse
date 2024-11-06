import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import response from 'src/helpers/response';
import { Response } from 'express';
import { SignUpDto } from './dto/signup.dto';
import { CONSTANT } from 'src/helpers/constants/message';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body()
    signUpDto: SignUpDto,
    @Res() res: Response,
  ) {
    const data = await this.authService.signUp(signUpDto);
    return response.successCreate(
      {
        message: CONSTANT.SIGN_UP,
        data: data,
      },
      res,
    );
  }
}
