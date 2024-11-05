import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
// import { CONSTANT } from './helpers/constants/message';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // throw new BadRequestException({ message: CONSTANT.METHOD_NOT_ALLOWED });
    return this.appService.getHello();
  }
}
