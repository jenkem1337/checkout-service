import { AggregateRoot, CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import CompleteCheckoutCommand from "../Command/CompleteCheckoutCommand";
import CheckoutRepository from "src/Core/Interfaces/CheckoutRepository";
import { Inject } from "@nestjs/common";
import SuccessResult from "src/Core/Models/Result/SuccsessResult";
import NullCheckout from "src/Core/Models/Domain Models/Checkout/NullCheckout";
import Checkout from "src/Core/Models/Domain Models/Checkout/Checkout";
import ICheckoutRepositoryFactory from "src/Core/Interfaces/ICheckoutRepositoryFactory";

@CommandHandler(CompleteCheckoutCommand)
export default class CompleteCheckoutCommandHandler implements ICommandHandler<CompleteCheckoutCommand> {
    constructor(
        @Inject("CheckoutRepositoryFactory") 
        private readonly checkoutRepositoryFactory: ICheckoutRepositoryFactory,
        private readonly eventPublisher:EventPublisher
    ){}
    
    async execute(command: CompleteCheckoutCommand): Promise<any> {
        const checkoutRepository = this.checkoutRepositoryFactory.createCheckoutRepository()
        const checkout = await checkoutRepository.findOneByUuidAndCustomerUuid(command.checkoutUuid, command.userUuid)
        
        if(checkout.isNull()) throw new NullCheckout()
        
        checkout.isCheckoutCancelled()
        
        checkout.completeThisCheckout({
            paymentDetail: command.peymentDetail,
            paymentMethod: command.peymentMethod,
            addressOwnerName: command.orderAddress.name,
            addressOwnerSurname: command.orderAddress.surname,
            addressCountry: command.orderAddress.country,
            addressDistrict: command.orderAddress.district,
            addressName: command.orderAddress.title,
            addressProvince:command.orderAddress.city,
            addressZipCode:command.orderAddress.postalCode,
            fullAddressInformation: command.orderAddress.address
        })

        await checkoutRepository.saveChanges(checkout as Checkout)
        
        this.eventPublisher.mergeObjectContext(checkout as Checkout).commit()
        
        return new SuccessResult({
            
        })
    }

}