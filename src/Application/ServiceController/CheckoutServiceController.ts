import { Controller } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import CreateCheckoutCommand from '../../Core/Services/Commands/Command/CreateCheckoutCommand';
import TransactionalCommand from '../../Core/Services/Commands/Command/TransactionalCommand';

@Controller()
export default class CheckoutServiceController {
    constructor(
        private readonly commandBus: CommandBus
    ){}
    @MessagePattern({cmd: "create_checkout"})
    async createCheckout(@Payload() payload:string){
        
        this.commandBus.execute(new TransactionalCommand(
                                        new CreateCheckoutCommand(payload)
                                    ))
        return payload
    }
}