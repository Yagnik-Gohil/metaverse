import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '@modules/token/entities/token.entity';
import { Asset } from '@modules/asset/entities/asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token, Asset])],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
