import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { EmailService } from 'src/helpers/services/email-service';

@Injectable()
export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  async signUp(signUpDto: SignUpDto) {
    // Simulate hashing password and storing user
    const hashedPassword = `hashed-${signUpDto.password}`;
    const userId = Date.now();

    // Return a mock response (In real code, you would save to DB and return saved user data)
    return {
      id: userId,
      email: signUpDto.email,
      password: hashedPassword,
      token: 'some-jwt-token', // Assume a token is generated
    };
  }
}
