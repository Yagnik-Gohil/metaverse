import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import * as fs from 'fs/promises';
import response from '@shared/response';
import { Response } from 'express';
import { AuthGuard } from '@shared/guard/auth.guard';
import { MESSAGE } from '@shared/constants/constant';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'public/image',
        filename: (req, file, cb) => {
          const fileName = `${uuid()}${path.extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
      limits: {
        fileSize: 1024 * 1024, // 1MB size limit
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|jpg|png)$/)) {
          return cb(new BadRequestException('InvalidType'), false);
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string,
    @Res() res: Response,
  ) {
    if (!file) {
      throw new BadRequestException(MESSAGE.FILE_REQUIRED);
    }

    if (!folder) {
      throw new BadRequestException('Folder name is required.');
    }

    const filePath = path.resolve('public/image', file.filename);

    try {
      const image = await this.uploadService.uploadFileFromDisk(
        filePath,
        file.mimetype,
        folder,
      );

      // Delete the temporary file after successful upload
      await fs.unlink(filePath);

      return response.successCreate(
        {
          message: MESSAGE.RECORD_UPLOAD('File'),
          data: image,
        },
        res,
      );
    } catch (error) {
      await fs.unlink(filePath).catch(() => null);
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }
}
