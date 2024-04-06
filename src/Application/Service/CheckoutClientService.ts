import { Inject, Injectable } from "@nestjs/common";
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
import ITransactionManagerFactory from "src/Core/Interfaces/ITransactionManagerFactory";

@Injectable()
export default class CheckoutService {
    constructor(
        @Inject("TransactionManagerFactory")
        private readonly transactionManagerFactory:ITransactionManagerFactory,
        private readonly commandBus:CommandBus,
        private readonly queryBus:QueryBus
    ){}

    async addAnItemToCheckout(dto: AddAnCheckoutItemDto){
        const tx = await this.transactionManagerFactory.createTransactionFactory()
        return await tx.startTransaction(async () => {
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
        const tx = await this.transactionManagerFactory.createTransactionFactory()
        return await tx.startTransaction(async () => {
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
        const tx = await this.transactionManagerFactory.createTransactionFactory()
        return await tx.startTransaction(async () => {
            return await this.commandBus.execute(
                new TakeOutAnItemCommand(dto.checkoutUuid, dto.checkoutItemUuid, dto.customerUuid)
            )
    
        })
    }
    async deleteItemOneMoreThan(dto: DeleteItemOneMoreThanDto){
        const tx = await this.transactionManagerFactory.createTransactionFactory()
        return await tx.startTransaction(async () => {
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
        const tx = await this.transactionManagerFactory.createTransactionFactory()
        return await tx.startTransaction(async () => {
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
        const tx = await this.transactionManagerFactory.createTransactionFactory()
        return await tx.startTransaction(async () => {
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
        const tx = await this.transactionManagerFactory.createTransactionFactory()
        return await tx.startTransaction(async () => {
            return await this.commandBus.execute(
                new CancelCheckoutCommand(checkoutUuid, customerUuid)
            )
    
        })
    }
}