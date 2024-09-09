import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import CheckoutClientModule from './Application/Modules/CheckoutClientModule/CheckoutClientModule';
async function bootstrap() {
  
  const app = await NestFactory.create(CheckoutClientModule);
  await app.listen(process.env.APP_PORT);
}
bootstrap();
