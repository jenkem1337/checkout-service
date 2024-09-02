import { NestFactory } from '@nestjs/core';
import { AppModule } from './Modules/AppModule';
import * as dotenv from "dotenv"
async function bootstrap() {
  dotenv.config()
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
