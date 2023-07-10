import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import CreateCheckoutCommand from "../Command/CreateCheckoutCommand";
import CheckoutRepository from "../../../../Core/Interfaces/CheckoutRepository";
import { Inject } from "@nestjs/common";
import { IDomainModelFactoryContext } from "../../../../Core/Models/Factories/DomainModelFactoryContext";
import CreateCheckoutWithCheckoutCreatedEventFactory from "../../../../Core/Models/Factories/Checkout/CreateCheckoutWithCheckoutCreatedEventFactory";
import CheckoutConstructorParamaters from "../../../../Core/Models/Factories/Checkout/CheckoutConstructorParameters";
import Checkout from '../../../Models/Domain Models/Checkout/Checkout';
import SuccessResult from '../../../Models/Result/SuccsessResult';
import CheckoutUuidResult from '../../../Models/Result/AbstractResultTypes/CheckoutUuidResult';

@CommandHandler(CreateCheckoutCommand)
export default class CreateCheckoutCommandHandler implements ICommandHandler<CreateCheckoutCommand> {
    constructor(
        @Inject("CheckoutRepository")
        private readonly checkoutWriteRepository: CheckoutRepository,
        @Inject("DomainModelFactoryContext")
        private readonly domainFactoryContext: IDomainModelFactoryContext,
        private readonly eventPublisher: EventPublisher
    ){}
    
    async execute(command: CreateCheckoutCommand): Promise<any> {
        const checkoutDomainModel = this.domainFactoryContext.setFactoryMethod(CreateCheckoutWithCheckoutCreatedEventFactory.name)
                                                            .createInstance<Checkout, CheckoutConstructorParamaters>({
                                                                userUuid: command.customerUuid
                                                            })
        
        this.checkoutWriteRepository.saveChanges(checkoutDomainModel)
        
        this.eventPublisher.mergeObjectContext(checkoutDomainModel).commit()
        
        return new SuccessResult(
            new CheckoutUuidResult(checkoutDomainModel.getUuid().getUuid()))
    }


}