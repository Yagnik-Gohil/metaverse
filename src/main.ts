import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.setGlobalPrefix('api');
  app.enableCors();
  app.enable('trust proxy', true);
  await app.listen(+port);
}
bootstrap();
