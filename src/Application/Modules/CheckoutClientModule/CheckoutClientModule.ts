import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import CheckoutClientController from '../../ClientController/CheckoutClientController';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import JwtStrategy from '../../Auth/JwtAuthPassport';
import { CqrsModule } from "@nestjs/cqrs";
import HandlerModule from "../Handlers/HandlerModule";
import CheckoutService from "../../Service/CheckoutClientService";
import { AlsModule } from "../AlsModule";
import { AsyncLocalStorage } from "async_hooks";
import { QueryRunner } from "typeorm";
import TransactionManagerFactoryModule from "../RepositoryModule/TransactionManagerFactoryModule";


@Module({
    controllers:[CheckoutClientController],
    providers: [CheckoutService, JwtStrategy],
    imports:[
        JwtModule.register({secret: "$2y$10$YZM.npx0LPKqbmQjzWNTWeqX06MUkm6wtsS2jxdDtasWWXFzNhuES"}),
        PassportModule,
        HandlerModule, 
        CqrsModule,
        AlsModule,
        TransactionManagerFactoryModule
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