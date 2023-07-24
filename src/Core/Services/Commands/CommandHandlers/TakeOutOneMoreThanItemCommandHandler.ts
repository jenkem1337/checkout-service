import {CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import Result from "src/Core/Interfaces/Result";
import { Inject } from "@nestjs/common";
import CheckoutRepository from "src/Core/Interfaces/CheckoutRepository";
import CheckoutNotFound from "src/Core/Exceptions/CheckoutNotFound";
import ProductQuantity from "src/Core/Models/ValueObjects/ProductQuantity";
import CheckoutItemID from "src/Core/Models/ValueObjects/CheckoutItemID";
import Checkout from "src/Core/Models/Domain Models/Checkout/Checkout";
import SuccessResult from "src/Core/Models/Result/SuccsessResult";
import TakeOutOneMoreThanItemCommand from "../Command/TakeOutOneMoreThanItemCommand";

@CommandHandler(TakeOutOneMoreThanItemCommand)
export default class TakeOutOneMoreThanItemCommandHandler implements ICommandHandler<TakeOutOneMoreThanItemCommand, Result<object>>{
    constructor(
        @Inject("CheckoutRepository") 
        private readonly checkoutWriteRepository: CheckoutRepository,
        private readonly eventPublisher: EventPublisher,
    ){}

    async execute(command: TakeOutOneMoreThanItemCommand): Promise<Result<object>> {
        const checkoutDomainModel = await this.checkoutWriteRepository.findOneByUuidAndCustomerUuid(command.checkoutUuid, command.customerUuid)
        
        if(checkoutDomainModel.isNull()) throw new CheckoutNotFound()
        checkoutDomainModel.isCheckoutCancelled()
        
        checkoutDomainModel.takeOutOneMoreThanItem(
            new CheckoutItemID(command.checkoutItemUuid),
            new ProductQuantity(command.quantity)
        )
        
        await this.checkoutWriteRepository.saveChanges(checkoutDomainModel as Checkout)
        this.eventPublisher.mergeObjectContext(checkoutDomainModel as  Checkout).commit()
        
        return new SuccessResult({
            checkout_item_uuid: command.checkoutItemUuid,
            quantity: command.quantity
        })
    }
}