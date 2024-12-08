import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { AuthGuard } from '@shared/guard/auth.guard';
import { RolesGuard } from '@shared/guard/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import response from '@shared/response';
import { MESSAGE, VALUE } from '@shared/constants/constant';
import { Response } from 'express';

@Controller('avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  async create(@Body() createAvatarDto: CreateAvatarDto, @Res() res: Response) {
    const data = await this.avatarService.create(createAvatarDto);
    return response.successCreate(
      {
        message: MESSAGE.RECORD_CREATED('Avatar'),
        data,
      },
      res,
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Query('limit') limit: number = VALUE.limit,
    @Query('offset') offset: number = VALUE.offset,
    @Res() res: Response,
  ) {
    const [list, count] = await this.avatarService.findAll(limit, offset);
    return response.successResponseWithPagination(
      {
        message: MESSAGE.RECORD_FOUND('Avatar'),
        total: count,
        limit: +limit,
        offset: +offset,
        data: list,
      },
      res,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  async remove(@Param('id') id: string, @Res() res: Response) {
    // ! REMOVE IMAGES FROM S3
    const data = await this.avatarService.remove(id);
    return response.successResponse(
      {
        message: data.affected
          ? MESSAGE.RECORD_DELETED('Avatar')
          : MESSAGE.RECORD_NOT_FOUND('Avatar'),
        data: {},
      },
      res,
    );
  }
}
