import { Controller } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import CreateCheckoutCommand from '../../Core/Services/Commands/Command/CreateCheckoutCommand';
import TransactionalCommand from '../../Core/Services/Commands/Command/TransactionalCommand';
import CheckoutByUuidAndCustomerUuidQuery from "src/Core/Services/Queries/Query/CheckoutByUuidAndCustomerUuidQuery";

@Controller()
export default class CheckoutServiceController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ){}
    @MessagePattern({cmd: "create_checkout"})
    async createCheckout(@Payload() uuid:string){
        
        return await this.commandBus.execute(new TransactionalCommand(
                                        new CreateCheckoutCommand(uuid)
                                    ))
    }

    @MessagePattern({cmd: "find_an_checkout_by_uuid_and_customer_uuid"})
    async findAnCheckoutByUuidAndCustomerUuid(@Payload() payload:{checkoutUuid:string, customerUuid:string}){
        return await this.queryBus.execute(
            new CheckoutByUuidAndCustomerUuidQuery(payload.checkoutUuid, payload.customerUuid)
        )
    }
}