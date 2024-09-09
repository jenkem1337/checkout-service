import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import JwtStrategy from '../../Auth/JwtAuthPassport';
import { CqrsModule } from "@nestjs/cqrs";
import HandlerModule from "../Handlers/HandlerModule";
import CheckoutService from "../../Service/CheckoutService";
import { AlsModule } from "../AlsModule";
import { AsyncLocalStorage } from "async_hooks";
import { QueryRunner } from "typeorm";
import TransactionManagerFactoryModule from "../RepositoryModule/TransactionManagerModule";
import CheckoutController from "../../Controller/CheckoutController";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";


@Module({
    controllers:[CheckoutController],
    providers: [CheckoutService, JwtStrategy],
    imports:[
        ConfigModule.forRoot({
            envFilePath: [".env"]
        }),
        JwtModule.register({secret: process.env.JWT_SECRET_TOKEN}),
        PassportModule,
        HandlerModule, 
        CqrsModule,
        AlsModule,
        TransactionManagerFactoryModule,
        HttpModule
    ]
})
export default class CheckoutClientModule implements NestModule{
    constructor(
        private readonly als: AsyncLocalStorage<Map<string, QueryRunner>>
      ) {}
    
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply((req, res, next) => {
          this.als.run(new Map(), () => next());
        })
        .forRoutes('*');
  
    }

}