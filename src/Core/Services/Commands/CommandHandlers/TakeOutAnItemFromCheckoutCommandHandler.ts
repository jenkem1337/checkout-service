import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import TakeOutAnItemCommand from "../Command/TakeOutAnItemCommand";
import Result from "src/Core/Interfaces/Result";
import SuccessResult from "src/Core/Models/Result/SuccsessResult";
import CheckoutRepository from "src/Core/Interfaces/CheckoutRepository";
import { Inject } from "@nestjs/common";
import CheckoutNotFound from "src/Core/Exceptions/CheckoutNotFound";
import CheckoutItemID from "src/Core/Models/ValueObjects/CheckoutItemID";
import Checkout from "src/Core/Models/Domain Models/Checkout/Checkout";
import { DataSource } from 'typeorm';
import ICheckoutRepositoryFactory from "src/Core/Interfaces/ICheckoutRepositoryFactory";

@CommandHandler(TakeOutAnItemCommand)
export default class TakeOutAnItemFromCheckoutCommandHandler implements ICommandHandler<TakeOutAnItemCommand, Result<object>>{
    constructor(
        @Inject("DataSource")
        private readonly dataSource:DataSource,
        @Inject("CheckoutRepositoryFactory") 
        private readonly checkoutRepositoryFactory: ICheckoutRepositoryFactory,
        private readonly eventPublisher: EventPublisher,
        ){}

    
    async execute(command: TakeOutAnItemCommand): Promise<Result<object>> {
        const checkoutRepository = this.checkoutRepositoryFactory.createCheckoutRepository()
            
        const checkoutDomainModel = await checkoutRepository.findOneByUuidAndCustomerUuid(command.checkoutUuid, command.customerUuid)

        if(checkoutDomainModel.isNull()) throw new CheckoutNotFound()
        checkoutDomainModel.isCheckoutCancelled()
        
        checkoutDomainModel.takeOutAnItem(new CheckoutItemID(command.checkoutItemUuid))
        
        await checkoutRepository.saveChanges(checkoutDomainModel as Checkout)
        this.eventPublisher.mergeObjectContext(checkoutDomainModel as  Checkout).commit()
        return new SuccessResult({
            checkout_item_uuid: command.checkoutItemUuid
        })
    
    }

}