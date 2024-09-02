import { Inject, Injectable, Scope } from "@nestjs/common";
import AddAnCheckoutItemDto from "../ClientController/DTOs/AddAnCheckoutItemDto";
import AddOneMoreThanItemDto from "../ClientController/DTOs/AddOneMoreThanItemDto";
import DeleteAnItemDto from "../ClientController/DTOs/DeleteAnItemDto";
import DeleteItemOneMoreThanDto from "../ClientController/DTOs/DeleteItemOneMoreThanDto";
import DeleteSameItemsDto from "../ClientController/DTOs/DeleteSameItems";
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import AddItemOneMoreThanCommand from "src/Core/Services/Commands/Command/AddItemOneMoreThanCommand";
import TakeOutAnItemCommand from "src/Core/Services/Commands/Command/TakeOutAnItemCommand";
import TakeOutOneMoreThanItemCommand from "src/Core/Services/Commands/Command/TakeOutOneMoreThanItemCommand";
import TakeOutSameItemsCommand from "src/Core/Services/Commands/Command/TakeOutSameItemCommand";
import CreateCheckoutCommand from "src/Core/Services/Commands/Command/CreateCheckoutCommand";
import CheckoutByUuidAndCustomerUuidQuery from "src/Core/Services/Queries/Query/CheckoutByUuidAndCustomerUuidQuery";
import CancelCheckoutCommand from "src/Core/Services/Commands/Command/CancelCheckoutCommand";
import AddAnItemCommand from "src/Core/Services/Commands/Command/AddAnItemCommand";
import ITransactionManager from "src/Core/Interfaces/ITransactionManager";

@Injectable({scope:Scope.TRANSIENT})
export default class CheckoutService {
    constructor(
        @Inject("TransactionManager")
        private readonly transactionManager:ITransactionManager,
        private readonly commandBus:CommandBus,
        private readonly queryBus:QueryBus,
    ){}
    async addAnItemToCheckout(dto: AddAnCheckoutItemDto){
        return await this.transactionManager.startTransaction(async () => {
            return await this.commandBus.execute(
                new AddAnItemCommand(
                    dto.checkoutUuid,
                    dto.customerUuid,
                    dto.checkoutItemUuid,
                    dto.productUuid,    
                    dto.quantity
                )
            )
        })
    }
    async addOneMoreThanItemToCheckout(dto:AddOneMoreThanItemDto){
        return await this.transactionManager.startTransaction(async () => {
            return await this.commandBus.execute(
                new AddItemOneMoreThanCommand(
                    dto.checkoutUuid,
                    dto.customerUuid,
                    dto.checkoutItemUuid,
                    dto.quantity
                )
            )
    
        })
    }
    async deleteAnItemFromCheckout(dto: DeleteAnItemDto){
        return await this.transactionManager.startTransaction(async () => {
            return await this.commandBus.execute(
                new TakeOutAnItemCommand(dto.checkoutUuid, dto.checkoutItemUuid, dto.customerUuid)
            )
    
        })
    }
    async deleteItemOneMoreThan(dto: DeleteItemOneMoreThanDto){
        return await this.transactionManager.startTransaction(async () => {
            return await this.commandBus.execute(
                new TakeOutOneMoreThanItemCommand(
                    dto.checkoutUuid,
                    dto.checkoutItemUuid,
                    dto.customerUuid,
                    dto.quantity
                )
            )
    
        })
    }
    async deleteSameItems(dto:DeleteSameItemsDto) {
        return await this.transactionManager.startTransaction(async () => {
            return await this.commandBus.execute(
                new TakeOutSameItemsCommand(
                    dto.checkoutItemUuid,
                    dto.checkoutUuid,
                    dto.customerUuid
                )
            )
    
        })
    }
    async createCheckout(customerUuid:string){
        return await this.transactionManager.startTransaction(async () => {
            return await this.commandBus.execute(
                new CreateCheckoutCommand(customerUuid)
            )
    
        })
}

    async findAnCheckoutByUuidAndCustomerUuid(checkoutUuid:string, customerUuid:string){

        return await this.queryBus.execute(
            new CheckoutByUuidAndCustomerUuidQuery(checkoutUuid, customerUuid)
        )
    }

    async cancelCheckout(checkoutUuid:string, customerUuid:string){
        return await this.transactionManager.startTransaction(async () => {
            return await this.commandBus.execute(
                new CancelCheckoutCommand(checkoutUuid, customerUuid)
            )
    
        })
    }
}