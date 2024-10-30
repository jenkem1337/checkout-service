import { Inject, Injectable, Scope } from "@nestjs/common";
import AddAnCheckoutItemDto from "../Controller/DTOs/AddAnCheckoutItemDto";
import AddOneMoreThanItemDto from "../Controller/DTOs/AddOneMoreThanItemDto";
import DeleteAnItemDto from "../Controller/DTOs/DeleteAnItemDto";
import DeleteItemOneMoreThanDto from "../Controller/DTOs/DeleteItemOneMoreThanDto";
import DeleteSameItemsDto from "../Controller/DTOs/DeleteSameItems";
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import AddItemOneMoreThanCommand from "src/Core/Services/Commands/Command/AddItemOneMoreThanCommand";
import TakeOutAnItemCommand from "src/Core/Services/Commands/Command/TakeOutAnItemCommand";
import TakeOutOneMoreThanItemCommand from "src/Core/Services/Commands/Command/TakeOutOneMoreThanItemCommand";
import TakeOutSameItemsCommand from "src/Core/Services/Commands/Command/TakeOutSameItemCommand";
import CreateCheckoutCommand from "src/Core/Services/Commands/Command/CreateCheckoutCommand";
import CancelCheckoutCommand from "src/Core/Services/Commands/Command/CancelCheckoutCommand";
import AddAnItemCommand from "src/Core/Services/Commands/Command/AddAnItemCommand";
import ITransactionManager from "src/Core/Interfaces/ITransactionManager";
import { HttpService } from "@nestjs/axios";
import ProductNotFound from "src/Core/Exceptions/ProductNotFound";
import CompleteCheckoutCommand from "src/Core/Services/Commands/Command/CompleteCheckoutCommand";
import CompleteCheckoutDto from "../Controller/DTOs/CompleteCheckoutDto";

@Injectable()
export default class CheckoutService {
    constructor(
        @Inject("TransactionManager")
        private readonly transactionManager:ITransactionManager,
        private readonly commandBus:CommandBus,
        private readonly httpService:HttpService
    ){}
    async addAnItemToCheckout(dto: AddAnCheckoutItemDto){
        const anProductFromProductService = await this.httpService.axiosRef.get(`${process.env.E_COMMARCE_MONOLITH_SERVICE}/products/${dto.productUuid}`)
        
        if ((anProductFromProductService.data.error_message !== null) && (anProductFromProductService.data.error_message !== undefined)) {
            throw new ProductNotFound(dto.productUuid)
        }
        
        return await this.transactionManager.startTransaction(async () => {
            console.log(anProductFromProductService.data.data.header)
            return await this.commandBus.execute(
                new AddAnItemCommand(
                    dto.checkoutUuid,
                    dto.customerUuid,
                    dto.checkoutItemUuid,
                    dto.productUuid,    
                    dto.quantity,
                    anProductFromProductService.data.data.price,
                    anProductFromProductService.data.data.header
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

    async cancelCheckout(checkoutUuid:string, customerUuid:string){
        return await this.transactionManager.startTransaction(async () => {
            return await this.commandBus.execute(
                new CancelCheckoutCommand(checkoutUuid, customerUuid)
            )
    
        })
    }

    async completeCheckout(dto:CompleteCheckoutDto){
        return await this.transactionManager.startTransaction( async () => {
            return await this.commandBus.execute(
                new CompleteCheckoutCommand(
                    dto.userUuid,
                    dto.checkoutUuid,
                    dto.peymentMethod,
                    dto.peymentDetail,
                    dto.orderAddress
                )
            )
        })
    }
}