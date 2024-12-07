import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envConfiguration } from 'config/configuration';
import { envSchema } from 'config/validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { database } from 'config/database';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TokenModule } from './modules/token/token.module';
import { OtpModule } from './modules/otp/otp.module';
import { AdminModule } from './modules/admin/admin.module';
import { Token } from './modules/token/entities/token.entity';
import { MapModule } from './modules/map/map.module';
import { UploadModule } from './modules/upload/upload.module';
import { AssetModule } from './modules/asset/asset.module';
import { AvatarModule } from './modules/avatar/avatar.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${__dirname}/../../config/env/${process.env.NODE_ENV}.env`,
      load: [envConfiguration],
      isGlobal: true,
      validationSchema: envSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => database(configService),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    TokenModule,
    OtpModule,
    AdminModule,
    TypeOrmModule.forFeature([Token]),
    MapModule,
    UploadModule,
    AssetModule,
    AvatarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
