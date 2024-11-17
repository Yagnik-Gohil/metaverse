import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@shared/guard/auth.guard';
import { RolesGuard } from '@shared/guard/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { Response } from 'express';
import { MESSAGE, VALUE } from '@shared/constants/constant';
import response from '@shared/response';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  async findAll(
    @Query('limit') limit: number = VALUE.limit,
    @Query('offset') offset: number = VALUE.offset,
    @Res() res: Response,
  ) {
    const [list, count] = await this.userService.findAll({
      take: +limit,
      skip: +offset,
    });
    return response.successResponseWithPagination(
      {
        message: MESSAGE.RECORD_FOUND('Users'),
        total: count,
        limit: +limit,
        offset: +offset,
        data: list,
      },
      res,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const data = await this.userService.findOne(id);
    return response.successResponse(
      {
        message: data
          ? MESSAGE.RECORD_FOUND('User')
          : MESSAGE.RECORD_NOT_FOUND('User'),
        data,
      },
      res,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
