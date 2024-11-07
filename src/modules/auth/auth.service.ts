import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../token/entities/token.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CONSTANT } from '@root/src/shared/constants/message';
import * as bcrypt from 'bcrypt';
import { Otp } from '../otp/entities/otp.entity';
import generateRandomOtp from '@root/src/shared/function/generate-random-otp';
import { OtpType } from '@root/src/shared/constants/enum';
import sendOtp from 'src/shared/function/send-otp';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  }

  async signUp(signUpDto: SignUpDto) {
    const isExists = await this.userRepository.findOne({
      where: {
        email: signUpDto.email,
      },
    });

    if (isExists) {
      throw new BadRequestException(CONSTANT.ALREADY_EXISTS('User'));
    }

    const hashedPassword = await this.hashPassword(signUpDto.password);

    const user = await this.userRepository.save({
      name: signUpDto.name,
      email: signUpDto.email,
      password: hashedPassword,
    });

    // Store OTP to database
    const createOtp = {
      user: user,
      otp: generateRandomOtp(),
      email: user.email,
      type: OtpType.SIGN_UP,
      expire_at: Math.floor((Date.now() + 600000) / 1000), // Add 10 minutes (600,000 milliseconds) to the current timestamp & Convert future timestamp to seconds
    };
    const otp = await this.otpRepository.save(createOtp);

    // Send OTP to user's email
    await sendOtp(user, otp.otp);

    return CONSTANT.VERIFY_OTP_SENT_TO(user.email);
  }
}
