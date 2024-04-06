import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import CancelCheckoutCommand from "../Command/CancelCheckoutCommand";
import Result from "src/Core/Interfaces/Result";
import { Inject } from '@nestjs/common';
import CheckoutRepository from "src/Core/Interfaces/CheckoutRepository";
import SuccessResult from '../../../../Core/Models/Result/SuccsessResult';
import CheckoutNotFound from "src/Core/Exceptions/CheckoutNotFound";
import Checkout from "src/Core/Models/Domain Models/Checkout/Checkout";
import ICheckoutRepositoryFactory from "src/Core/Interfaces/ICheckoutRepositoryFactory";

@CommandHandler(CancelCheckoutCommand)
export default class CancelCheckoutCommandHandler implements ICommandHandler<CancelCheckoutCommand, Result<object>>{
    constructor(
        @Inject("CheckoutRepositoryFactory")
        private readonly checkoutRepositoryFactory: ICheckoutRepositoryFactory,
        private readonly eventPublisher: EventPublisher
    ){}
    async execute(command: CancelCheckoutCommand): Promise<Result<object>> {
        const checkoutRepository = this.checkoutRepositoryFactory.createCheckoutRepository()
        const checkout = await checkoutRepository.findOneByUuidAndCustomerUuid(command.checkoutUuid, command.customerUuid)
        
        if(checkout.isNull()) throw new CheckoutNotFound()
        checkout.isCheckoutCancelled()
        
        const publishableCheckout = this.eventPublisher.mergeObjectContext(checkout as Checkout)
        
        publishableCheckout.cancelThisCheckout()
        
        await checkoutRepository.saveChanges(publishableCheckout)
        
        publishableCheckout.commit()
        return new SuccessResult({message: "Checkout successfully cancelled."});
    }
    

}