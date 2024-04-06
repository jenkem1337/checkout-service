import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import Result from "src/Core/Interfaces/Result";
import { Inject } from "@nestjs/common";
import CheckoutRepository from "src/Core/Interfaces/CheckoutRepository";
import CheckoutNotFound from "src/Core/Exceptions/CheckoutNotFound";
import CheckoutItemID from "src/Core/Models/ValueObjects/CheckoutItemID";
import Checkout from "src/Core/Models/Domain Models/Checkout/Checkout";
import SuccessResult from "src/Core/Models/Result/SuccsessResult";
import TakeOutSameItemsCommand from "../Command/TakeOutSameItemCommand";
import ICheckoutRepositoryFactory from "src/Core/Interfaces/ICheckoutRepositoryFactory";

@CommandHandler(TakeOutSameItemsCommand)
export default class TakeOutSameItemsFromCheckoutCommandHandler implements ICommandHandler<TakeOutSameItemsCommand, Result<object>> {
    constructor(
        @Inject("CheckoutRepositoryFactory") 
        private readonly checkoutRepositoryFactory: ICheckoutRepositoryFactory,
        private readonly eventPublisher: EventPublisher,
    ){}

    async execute(command: TakeOutSameItemsCommand): Promise<Result<object>> {
        const checkoutRepository = this.checkoutRepositoryFactory.createCheckoutRepository()
        const checkoutDomainModel = await checkoutRepository.findOneByUuidAndCustomerUuid(command.checkoutUuid, command.customerUuid)
        
        if(checkoutDomainModel.isNull()) throw new CheckoutNotFound()
        checkoutDomainModel.isCheckoutCancelled()
        
        checkoutDomainModel.takeOutSameItems(
            new CheckoutItemID(command.checkoutItemUuid),
        )
        
        await checkoutRepository.saveChanges(checkoutDomainModel as Checkout)
        this.eventPublisher.mergeObjectContext(checkoutDomainModel as  Checkout).commit()

        return new SuccessResult({
            checkout_item_uuid: command.checkoutItemUuid
        })
    }
}