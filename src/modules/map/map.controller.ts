import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MapService } from './map.service';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import response from '@shared/response';
import { MESSAGE, VALUE } from '@shared/constants/constant';
import { Response } from 'express';
import { AuthGuard } from '@shared/guard/auth.guard';
import { RolesGuard } from '@shared/guard/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  async create(@Body() createMapDto: CreateMapDto, @Res() res: Response) {
    const data = await this.mapService.create(createMapDto);
    return response.successCreate(
      {
        message: MESSAGE.RECORD_CREATED('Map'),
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
    const [list, count] = await this.mapService.findAll({
      relations: { thumbnail: true },
      select: {
        id: true,
        name: true,
        row: true,
        column: true,
        tile_size: true,
        created_at: true,
      },
      take: +limit,
      skip: +offset,
    });
    return response.successResponseWithPagination(
      {
        message: MESSAGE.RECORD_FOUND('Map'),
        total: count,
        limit: +limit,
        offset: +offset,
        data: list,
      },
      res,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const data = await this.mapService.findOne(id);
    return response.successResponse(
      {
        message: data
          ? MESSAGE.RECORD_FOUND('Map')
          : MESSAGE.RECORD_NOT_FOUND('Map'),
        data,
      },
      res,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  async update(
    @Param('id') id: string,
    @Body() updateMapDto: UpdateMapDto,
    @Res() res: Response,
  ) {
    // ! Manage image upload. REMOVE IMAGES FROM S3
    const data = await this.mapService.update(id, updateMapDto);
    return response.successResponse(
      {
        message: data.affected
          ? MESSAGE.RECORD_UPDATED('Map')
          : MESSAGE.RECORD_NOT_FOUND('Map'),
        data: {},
      },
      res,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  async remove(@Param('id') id: string, @Res() res: Response) {
    // ! REMOVE IMAGES FROM S3
    const data = await this.mapService.remove(id);
    return response.successResponse(
      {
        message: data.affected
          ? MESSAGE.RECORD_DELETED('Map')
          : MESSAGE.RECORD_NOT_FOUND('Map'),
        data: {},
      },
      res,
    );
  }
}
