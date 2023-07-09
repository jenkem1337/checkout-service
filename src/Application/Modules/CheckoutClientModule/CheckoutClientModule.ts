import { Module } from "@nestjs/common";
import CheckoutClientController from '../../ClientController/CheckoutClientController';
import CheckoutClientService from '../../ClientService/CheckoutClientService';
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    controllers:[CheckoutClientController],
    providers: [CheckoutClientService],
    imports:[
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