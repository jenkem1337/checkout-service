import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import JwtStrategy from 'src/Auth/JwtAuthPassport';
import CheckoutReadController from 'src/Controller/CheckoutReadController';
import CheckoutServiceImpl from 'src/Service/CheckoutServiceImpl';

@Module({
  imports: [
    JwtModule.register({secret: process.env.JWT_SECRET_TOKEN}),
    PassportModule
  ],
  controllers: [CheckoutReadController],
  providers: [
    {
        provide: "CheckoutService",
        useClass: CheckoutServiceImpl
    },
    JwtStrategy
  ],
})
export class AppModule {}
