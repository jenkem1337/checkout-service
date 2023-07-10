import { Module } from "@nestjs/common";
import CheckoutClientController from '../../ClientController/CheckoutClientController';
import CheckoutClientService from '../../ClientService/CheckoutClientService';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import JwtStrategy from '../../Auth/JwtAuthPassport';

@Module({
    controllers:[CheckoutClientController],
    providers: [CheckoutClientService, JwtStrategy],
    imports:[
        JwtModule.register({secret: "$2y$10$YZM.npx0LPKqbmQjzWNTWeqX06MUkm6wtsS2jxdDtasWWXFzNhuES"}),
        PassportModule,
        ClientsModule.register([{
            name:"CHECKOUT_SERVICE",
            transport:Transport.REDIS,
            options: {
                host:"localhost",
                port:6379
            }

        }])
    ]
})
export default class CheckoutClientModule {}