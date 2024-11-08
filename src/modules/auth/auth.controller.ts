import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import response from '@root/src/shared/response';
import { Request, Response } from 'express';
import { SignUpDto } from './dto/signup.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { LoginDto } from './dto/login.dto';
import { CONSTANT } from '@root/src/shared/constants/message';
import getIp from '@root/src/shared/function/get-ip';
import { EmailDto } from './dto/email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body()
    signUpDto: SignUpDto,
    @Res() res: Response,
  ) {
    const message = await this.authService.signUp(signUpDto);
    return response.successCreate(
      {
        message: message,
        data: {},
      },
      res,
    );
  }

  @Post('signup/resend-otp')
  async resendSignUp(
    @Body()
    emailDto: EmailDto,
    @Res() res: Response,
  ) {
    const message = await this.authService.resendSignupOtp(emailDto);
    return response.successResponse(
      {
        message: message,
        data: {},
      },
      res,
    );
  }

  @Post('signup/verify-otp')
  async verifySignUpOtp(
    @Body()
    verifyOtpDto: VerifyOtpDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ip = getIp(req);
    const data = await this.authService.verifySignupOtp(verifyOtpDto, ip);
    return response.successResponse(
      {
        message: CONSTANT.SIGN_UP,
        data: data,
      },
      res,
    );
  }

  @Post('login')
  async login(
    @Body()
    loginDto: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ip = getIp(req);
    const data = await this.authService.login(loginDto, ip);
    return response.successResponse(
      {
        message: data.message,
        data: data.data,
      },
      res,
    );
  }
}
