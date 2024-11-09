import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { CONSTANT } from '../constants/message';
import { IJwtPayload } from '../constants/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '@root/src/modules/token/entities/token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(CONSTANT.UNAUTHENTICATED);
    }
    try {
      const payload: IJwtPayload = await jwt.verify(
        token,
        process.env.JWT_SECRET,
      );
      if (payload) {
        const isExists = await this.tokenRepository.findOne({
          where: {
            [payload.table]: { id: payload.id },
            jwt: token,
          },
          relations: {
            [payload.table]: true,
          },
        });

        if (!isExists) {
          throw new UnauthorizedException(CONSTANT.UNAUTHENTICATED);
        }

        request[payload.table] = isExists[payload.table];
      } else {
        throw new UnauthorizedException(CONSTANT.UNAUTHENTICATED);
      }
    } catch {
      throw new UnauthorizedException(CONSTANT.UNAUTHENTICATED);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
