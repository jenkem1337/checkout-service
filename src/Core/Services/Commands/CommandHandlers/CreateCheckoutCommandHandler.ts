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
import ICheckoutRepositoryFactory from "src/Core/Interfaces/ICheckoutRepositoryFactory";

@CommandHandler(CreateCheckoutCommand)
export default class CreateCheckoutCommandHandler implements ICommandHandler<CreateCheckoutCommand> {
    constructor(
        @Inject("CheckoutRepositoryFactory")
        private readonly checkoutRepositoryFactory: ICheckoutRepositoryFactory,
        @Inject("DomainModelFactoryContext")
        private readonly domainFactoryContext: IDomainModelFactoryContext,
        private readonly eventPublisher: EventPublisher
    ){}
    
    async execute(command: CreateCheckoutCommand): Promise<any> {
        const checkoutRepository = this.checkoutRepositoryFactory.createCheckoutRepository()
        
        const checkoutDomainModel = this.domainFactoryContext.setFactoryMethod(CreateCheckoutWithCheckoutCreatedEventFactory.name)
                                                            .createInstance<Checkout, CheckoutConstructorParamaters>({
                                                                userUuid: command.customerUuid
                                                            })
        
        await checkoutRepository.saveChanges(checkoutDomainModel)
        
        this.eventPublisher.mergeObjectContext(checkoutDomainModel).commit()
        
        return new SuccessResult(
            new CheckoutUuidResult(checkoutDomainModel.getUuid().getUuid()))
    }


}