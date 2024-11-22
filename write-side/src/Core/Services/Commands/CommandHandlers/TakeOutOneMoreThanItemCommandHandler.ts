import {CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import Result from "src/Core/Interfaces/Result";
import { Inject } from "@nestjs/common";
import CheckoutNotFound from "src/Core/Exceptions/CheckoutNotFound";
import ProductQuantity from "src/Core/Models/ValueObjects/ProductQuantity";
import CheckoutItemID from "src/Core/Models/ValueObjects/CheckoutItemID";
import Checkout from "src/Core/Models/Domain Models/Checkout/Checkout";
import SuccessResult from "src/Core/Models/Result/SuccsessResult";
import TakeOutOneMoreThanItemCommand from "../Command/TakeOutOneMoreThanItemCommand";
import ICheckoutRepositoryFactory from "src/Core/Interfaces/ICheckoutRepositoryFactory";

@CommandHandler(TakeOutOneMoreThanItemCommand)
export default class TakeOutOneMoreThanItemCommandHandler implements ICommandHandler<TakeOutOneMoreThanItemCommand, Result<object>>{
    constructor(
        @Inject("CheckoutRepositoryFactory") 
        private readonly checkoutRepositoryFactory: ICheckoutRepositoryFactory,
        private readonly eventPublisher: EventPublisher,
    ){}

    async execute(command: TakeOutOneMoreThanItemCommand): Promise<Result<object>> {
        const checkoutRepository = this.checkoutRepositoryFactory.createCheckoutRepository()
        const checkoutDomainModel = await checkoutRepository.findOneByUuidAndCustomerUuid(command.checkoutUuid, command.customerUuid)
        
        if(checkoutDomainModel.isNull()) throw new CheckoutNotFound()
        
        checkoutDomainModel.takeOutOneMoreThanItem(
            new CheckoutItemID(command.checkoutItemUuid),
            new ProductQuantity(command.quantity)
        )
        
        await checkoutRepository.saveChanges(checkoutDomainModel as Checkout)
        this.eventPublisher.mergeObjectContext(checkoutDomainModel as  Checkout).commit()
        
        return new SuccessResult({
            checkout_item_uuid: command.checkoutItemUuid,
            quantity: command.quantity
        })
    }
}