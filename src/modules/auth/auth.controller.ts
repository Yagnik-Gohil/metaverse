import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import response from 'src/helpers/response';
import { Response } from 'express';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Req() req,
    @Body()
    signUpDto: SignUpDto,
    @Res() res: Response,
  ) {
    const data = await this.authService.signUp(signUpDto);
    return response.successCreate(
      {
        message: '',
        data: data,
      },
      res,
    );
  }
}
