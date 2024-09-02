import { NestFactory } from '@nestjs/core';
import {Transport, MicroserviceOptions} from "@nestjs/microservices"
import 'reflect-metadata';
import CheckoutMicroserviceModule from './Application/Modules/CheckoutMicroserviceModule/CheckoutMicroserviceModule';
import CheckoutClientModule from './Application/Modules/CheckoutClientModule/CheckoutClientModule';
async function bootstrap() {
  const app = await NestFactory.create(CheckoutClientModule);
  await app.listen(3000);

  const app2 = await NestFactory.createMicroservice<MicroserviceOptions>(
    CheckoutMicroserviceModule, {
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  });
  await app2.listen()
}
bootstrap();
