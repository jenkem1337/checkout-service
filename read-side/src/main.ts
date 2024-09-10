import { NestFactory } from '@nestjs/core';
import { AppModule } from './Modules/AppModule';
import ProjectionModule from './Modules/ProjectionModule';
import { Transport } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
async function bootstrap() {
    
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APP_PORT);
  
  const projectionListener = await NestFactory.createMicroservice(ProjectionModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId:`checkout-consumer-${randomUUID()}`,
        brokers: [`${process.env.MESSAGE_QUEUE_HOST}:${process.env.MESSAGE_QUEUE_PORT}`],
      },
      consumer: {
        groupId: 'checkout-consumer'
      }
    }
  
  })
  await projectionListener.listen()
}
bootstrap()