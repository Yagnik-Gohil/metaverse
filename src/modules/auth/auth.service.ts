import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../token/entities/token.entity';
import { IsNull, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Otp } from '../otp/entities/otp.entity';
import sendOtp from 'src/shared/function/send-otp';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { LoginDto } from './dto/login.dto';
import { Admin } from '../admin/entities/admin.entity';
import { EmailDto } from './dto/email.dto';
import { IJwtPayload } from '@shared/constants/types';
import { CONSTANT } from '@shared/constants/message';
import generateRandomOtp from '@shared/function/generate-random-otp';
import { OtpType, UserStatus } from '@shared/constants/enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {}

  async getToken(
    table: 'user' | 'admin',
    entity: User | Admin,
    deviceId: string,
    ip: string,
  ): Promise<string> {
    const token = await this.tokenRepository.findOne({
      where: {
        [table]: { id: entity.id },
        device_id: deviceId,
      },
    });

    // generate token
    const newToken = await this.generateToken({ id: entity.id, table });

    if (token) {
      const isExpired = await this.isTokenExpired(token.jwt);

      if (isExpired) {
        // Update with new token
        await this.tokenRepository.save({
          id: token.id,
          token: newToken,
          ip: ip,
          login_time: new Date().toISOString(),
        });
        // New Token
        return newToken;
      }

      // Update Login Time
      await this.tokenRepository.save({
        id: token.id,
        ip: ip,
        login_time: new Date().toISOString(),
      });
      // Old token which is not expired
      return token.jwt;
    }

    // Create new token
    const result = await this.tokenRepository.save({
      [table]: { id: entity.id },
      jwt: newToken,
      device_id: deviceId,
      ip: ip,
      login_time: new Date().toISOString(),
    });
    return result.jwt;
  }

  isTokenExpired = async (token: string) => {
    try {
      const valid = await jwt.verify(token, process.env.JWT_SECRET);
      if (valid) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      return true;
    }
  };

  generateToken = (payload: IJwtPayload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  /**
   *
   * @param password password in payload
   * @param hashedPassword password in database
   * @returns boolean
   */
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

  async resendSignupOtp(emailDto: EmailDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: emailDto.email,
      },
    });

    // User not exists
    if (!user) {
      throw new BadRequestException(CONSTANT.WRONG_CREDENTIALS);
    }

    // if Signup otp is not verified, then send new signup otp
    if (!user.is_verified) {
      // There is always one entry of signup OTP. We are sending it at signup time
      let otp = await this.otpRepository.findOne({
        where: {
          user: {
            id: user.id,
          },
          type: OtpType.SIGN_UP,
        },
      });

      // In case of first signup OTP is not created
      if (!otp) {
        const createOtp = {
          user: user,
          otp: generateRandomOtp(),
          email: user.email,
          type: OtpType.SIGN_UP,
          expire_at: Math.floor((Date.now() + 600000) / 1000), // Add 10 minutes (600,000 milliseconds) to the current timestamp & Convert future timestamp to seconds
        };
        otp = await this.otpRepository.save(createOtp);
        // Send OTP to user's email
        await sendOtp(user, otp.otp);
      } else {
        // Update Old OTP
        const updateOtp = {
          otp: generateRandomOtp(),
          expire_at: Math.floor((Date.now() + 600000) / 1000), // Add 10 minutes (600,000 milliseconds) to the current timestamp & Convert future timestamp to seconds
        };
        await this.otpRepository.update(otp.id, updateOtp);
        // Send OTP to user's email
        await sendOtp(user, updateOtp.otp);
      }

      return CONSTANT.VERIFY_OTP_SENT_TO(user.email);
    }

    // User is blocked
    if (user.status == UserStatus.BLOCKED) {
      throw new BadRequestException(CONSTANT.ACCOUNT_BLOCKED);
    }

    // Otp already verified
    throw new BadRequestException(CONSTANT.METHOD_NOT_ALLOWED);
  }

  async verifySignupOtp(verifyOtpDto: VerifyOtpDto, ip: string) {
    const otp = await this.otpRepository.findOne({
      where: {
        email: verifyOtpDto.email,
        otp: verifyOtpDto.otp,
        is_verified: false,
        type: OtpType.SIGN_UP,
      },
      relations: {
        user: true,
      },
    });

    // If entered wrong otp
    if (!otp) {
      throw new BadRequestException(CONSTANT.INVALID_OTP);
    }

    const isExpired =
      otp.expire_at - Math.floor(Date.now() / 1000) > 0 ? false : true;

    // If otp expired
    if (isExpired) {
      // Delete Old OTP
      await this.otpRepository.update(otp.id, {
        deleted_at: new Date().toISOString(),
      });

      throw new BadRequestException(CONSTANT.INVALID_OTP);
    }

    // Verify OTP.
    await this.otpRepository.update(otp.id, {
      is_verified: true,
    });

    // Verify User
    await this.userRepository.update(otp.user.id, {
      is_verified: true,
    });

    const loginResponse = await this.getLoginResponse(
      'user',
      otp.user,
      verifyOtpDto.device_id,
      ip,
    );
    return loginResponse;
  }

  async login(loginDto: LoginDto, ip: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.email,
      },
    });

    // User not exists
    if (!user) {
      throw new BadRequestException(CONSTANT.WRONG_CREDENTIALS);
    }

    // Signup is not complete
    if (!user.is_verified) {
      return {
        message: CONSTANT.COMPLETE_VERIFICATION,
        data: { type: 'signup', email: user.email },
      };
    }

    // User is blocked
    if (user.status == UserStatus.BLOCKED) {
      throw new BadRequestException(CONSTANT.ACCOUNT_BLOCKED);
    }

    const isCorrectPassword = await this.comparePassword(
      loginDto.password,
      user.password,
    );

    // Wrong Password
    if (!isCorrectPassword) {
      throw new BadRequestException(CONSTANT.WRONG_CREDENTIALS);
    }

    const loginResponse = await this.getLoginResponse(
      'user',
      user,
      loginDto.device_id,
      ip,
    );
    return { message: CONSTANT.LOGIN, data: loginResponse };
  }

  async loginAdmin(loginDto: LoginDto, ip: string) {
    const admin = await this.adminRepository.findOne({
      where: {
        email: loginDto.email,
      },
    });

    // Admin not exists
    if (!admin) {
      throw new BadRequestException(CONSTANT.WRONG_CREDENTIALS);
    }

    const isCorrectPassword = await this.comparePassword(
      loginDto.password,
      admin.password,
    );

    // Wrong Password
    if (!isCorrectPassword) {
      throw new BadRequestException(CONSTANT.WRONG_CREDENTIALS);
    }

    const loginResponse = await this.getLoginResponse(
      'admin',
      admin,
      loginDto.device_id,
      ip,
    );
    return { message: CONSTANT.LOGIN, data: loginResponse };
  }

  async getLoginResponse(
    table: 'user' | 'admin',
    entity: User | Admin,
    deviceId: string,
    ip: string,
  ) {
    const jwt = await this.getToken(table, entity, deviceId, ip);
    return {
      [table]: {
        id: entity.id,
        name: entity.name,
        email: entity.email,
        created_at: entity.created_at,
      },
      jwt,
    };
  }

  async logout(table: 'user' | 'admin', entity: Admin | User, ip: string) {
    const time = new Date().toISOString();
    const result = await this.tokenRepository.update(
      { [table]: { id: entity.id }, deleted_at: IsNull() },
      {
        jwt: 'logged out',
        logout_time: time,
        ip: ip,
        deleted_at: time,
      },
    );
    return result.affected ? CONSTANT.LOGOUT : CONSTANT.METHOD_NOT_ALLOWED;
  }
}
