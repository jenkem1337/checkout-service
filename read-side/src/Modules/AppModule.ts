import { Module } from '@nestjs/common';
import CheckoutReadController from 'src/Controller/CheckoutReadController';
import CheckoutServiceImpl from 'src/Service/CheckoutServiceImpl';

@Module({
  imports: [],
  controllers: [CheckoutReadController],
  providers: [
    {
        provide: "CheckoutService",
        useClass: CheckoutServiceImpl
    }
  ],
})
export class AppModule {}
