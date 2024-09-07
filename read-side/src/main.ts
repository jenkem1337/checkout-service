import { NestFactory } from '@nestjs/core';
import { AppModule } from './Modules/AppModule';
import * as dotenv from "dotenv"
import ProjectionModule from './Modules/ProjectionModule';
import { Transport } from '@nestjs/microservices';
async function bootstrap() {
  
  dotenv.config()
  
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APP_PORT);
  
  const queueTransportObject = {      
      transport: Transport.REDIS,
      options: {
        host: process.env.MESSAGE_QUEUE_HOST,
        port: new Number(process.env.MESSAGE_QUEUE_PORT).valueOf(),
    }
  }
  const projectionListener = await NestFactory.createMicroservice(ProjectionModule, queueTransportObject)
  await projectionListener.listen()
}
bootstrap()