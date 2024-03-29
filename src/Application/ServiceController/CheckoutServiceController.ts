import { Controller } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import CreateCheckoutCommand from '../../Core/Services/Commands/Command/CreateCheckoutCommand';
import TransactionalCommand from '../../Core/Services/Commands/Command/TransactionalCommand';
import CheckoutByUuidAndCustomerUuidQuery from "src/Core/Services/Queries/Query/CheckoutByUuidAndCustomerUuidQuery";
import CancelCheckoutCommand from '../../Core/Services/Commands/Command/CancelCheckoutCommand';
import AddAnCheckoutItemDto from "../ClientController/DTOs/AddAnCheckoutItemDto";
import AddAnItemCommand from "src/Core/Services/Commands/Command/AddAnItemCommand";
import AddOneMoreThanItemDto from "../ClientController/DTOs/AddOneMoreThanItemDto";
import AddItemOneMoreThanCommand from "src/Core/Services/Commands/Command/AddItemOneMoreThanCommand";
import DeleteAnItemDto from "../ClientController/DTOs/DeleteAnItemDto";
import TakeOutAnItemCommand from "src/Core/Services/Commands/Command/TakeOutAnItemCommand";
import DeleteItemOneMoreThanDto from '../ClientController/DTOs/DeleteItemOneMoreThanDto';
import TakeOutOneMoreThanItemCommand from "src/Core/Services/Commands/Command/TakeOutOneMoreThanItemCommand";
import DeleteSameItemsDto from "../ClientController/DTOs/DeleteSameItems";
import TakeOutSameItemsCommand from "src/Core/Services/Commands/Command/TakeOutSameItemCommand";

@Controller()
export default class CheckoutServiceController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ){}
    @MessagePattern({cmd: "add_an_item"})
    async addAnItem(@Payload() dto: AddAnCheckoutItemDto){
        return await this.commandBus.execute(new TransactionalCommand(
            new AddAnItemCommand(
                dto.checkoutUuid,
                dto.customerUuid,
                dto.checkoutItemUuid,
                dto.productUuid,
                dto.quantity
            )
        ))
    }

    @MessagePattern({cmd: "add_one_more_than_item"})
    async addOneMoreThanItemToCheckout(@Payload() dto: AddOneMoreThanItemDto){
        return await this.commandBus.execute(new TransactionalCommand(
            new AddItemOneMoreThanCommand(
                dto.checkoutUuid,
                dto.customerUuid,
                dto.checkoutItemUuid,
                dto.quantity
            )
        ))
    }

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
    @MessagePattern({cmd: "cancel_checkout"})
    async cancelCheckout(@Payload() payload:{checkoutUuid:string, customerUuid:string}){
        return await this.commandBus.execute(new TransactionalCommand(
            new CancelCheckoutCommand(payload.checkoutUuid, payload.customerUuid)
        ))
    }

    @MessagePattern({cmd: "delete-an-item"})
    async deleteAnItem(@Payload() payload: DeleteAnItemDto){
        return await this.commandBus.execute(new TransactionalCommand(
            new TakeOutAnItemCommand(payload.checkoutUuid, payload.checkoutItemUuid, payload.customerUuid)
        ))
    }
    @MessagePattern({cmd: "delete-item-one-more-than"})
    async deleteItemOneMoreThan(@Payload() dto: DeleteItemOneMoreThanDto){
        return await this.commandBus.execute(new TransactionalCommand(
            new TakeOutOneMoreThanItemCommand(
                dto.checkoutUuid,
                dto.checkoutItemUuid,
                dto.customerUuid,
                dto.quantity
            )
        ))
    }
    
    @MessagePattern({cmd: "delete-same-items"})
    async deleteSameItems(@Payload() dto: DeleteSameItemsDto){
        return await this.commandBus.execute(new TransactionalCommand(
            new TakeOutSameItemsCommand(
                dto.checkoutItemUuid,
                dto.checkoutUuid,
                dto.customerUuid
            )
        ))
    }
}
