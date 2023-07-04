import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import CreateNewCheckoutAndAddNewCheckoutItemCommand from '../Command/CreateNewCheckoutAndAddNewCheckoutItemCommand';
import CheckoutRepository from '../../../Interfaces/CheckoutRepository';
import { IDomainModelFactoryContext } from '../../../Models/Factories/DomainModelFactoryContext';
import CheckoutInterface from '../../../Models/Domain Models/Checkout/CheckoutInterface';
import CheckoutConstructorParamaters from '../../../Models/Factories/Checkout/CheckoutConstructorParameters';
import FromCheckoutCreatedFactory from '../../../Models/Factories/Checkout/FromCheckoutCreatedFactory';
import CheckoutItemInterface from '../../../Models/Domain Models/Checkout/CheckoutItemInterface';
import CheckoutItemConstructorParameters from '../../../Models/Factories/CheckoutItem/CheckoutItemConstructorParameters';
import ConcreateCheckoutItemFactory from '../../../Models/Factories/CheckoutItem/ConcreateCheckoutItem';
import Checkout from '../../../Models/Domain Models/Checkout/Checkout';

@CommandHandler(CreateNewCheckoutAndAddNewCheckoutItemCommand)
export default class CreateNewCheckoutAndAddNewCheckoutItemCommandHandler implements ICommandHandler<CreateNewCheckoutAndAddNewCheckoutItemCommand> {
    constructor(
        @Inject("CheckoutRepository") 
        private readonly checkoutWriteRepository:CheckoutRepository,
        @Inject("DomainModelFactoryContext") 
        private readonly domainModelFactoryContext: IDomainModelFactoryContext,
        private readonly eventPublisher: EventPublisher,
    ) {}

    async execute(command: CreateNewCheckoutAndAddNewCheckoutItemCommand): Promise<any> {
        const newCheckoutDomainModel = this.domainModelFactoryContext.setFactoryMethod(FromCheckoutCreatedFactory.name)
                                                                .createInstance<CheckoutInterface, CheckoutConstructorParamaters>({
                                                                    checkoutState:command.checkoutState,
                                                                    checkoutUuid:command.checkoutUuid,
                                                                    createdAt:command.checkoutCreatedDate,
                                                                    updatedAt:command.checkoutUpdatedDate,
                                                                    subTotal: command.checkoutSubTotal,
                                                                    userUuid: command.customerUuid,
                                                                })        
        const checkoutItem = this.domainModelFactoryContext.setFactoryMethod(ConcreateCheckoutItemFactory.name)
                                                        .createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({
                                                            checkoutItemUuid: command.checkoutItemUuid,
                                                            checkoutUuid: command.checkoutUuid,
                                                            createdAt: command.itemCreatedDate,
                                                            productBasePrice:command.productBasePrice,
                                                            productHeader:command.productHeader,
                                                            productQuantity: command.quantity,
                                                            productUuid: command.productUuid,
                                                            updatedAt: command.itemUpdatedDate
                                                        })

        newCheckoutDomainModel.addAnItem(checkoutItem)
        await this.checkoutWriteRepository.saveChanges(newCheckoutDomainModel as Checkout)
        
        this.eventPublisher.mergeObjectContext(newCheckoutDomainModel as Checkout).commit()

    }
}