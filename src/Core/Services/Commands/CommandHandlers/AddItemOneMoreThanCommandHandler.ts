import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import AddItemOneMoreThanCommand from '../Command/AddItemOneMoreThanCommand';
import CheckoutRepository from '../../../Interfaces/CheckoutRepository';
import { Inject } from '@nestjs/common';
import CheckoutBuilder from '../../../../Core/Models/Builders/CheckoutBuilder';
import CheckoutItemBuilder from '../../../../Core/Models/Builders/CheckoutItemBuilder';
import FromCreationalCommandCheckoutBuilderState from '../../../../Core/Models/Builders/States/CheckoutAggregateStates/FromCommandCheckoutBuilderState';
import ItMustBeConcreateCheckoutItemState from '../../../../Core/Models/Builders/States/CheckoutItemStates/ItMustBeConcreateCheckoutItemState';
import CheckoutInterface from '../../../../Core/Models/Domain Models/Checkout/CheckoutInterface';
import CheckoutID from '../../../../Core/Models/ValueObjects/CheckoutID';
import CheckoutItemID from '../../../../Core/Models/ValueObjects/CheckoutItemID';
import CheckoutState, { CheckoutStates } from '../../../../Core/Models/ValueObjects/CheckoutState';
import CustomerID from '../../../../Core/Models/ValueObjects/CustomerID';
import Money from '../../../../Core/Models/ValueObjects/Money';
import ProductHeader from '../../../../Core/Models/ValueObjects/ProductHeader';
import ProductID from '../../../../Core/Models/ValueObjects/ProductID';
import ProductQuantity from '../../../../Core/Models/ValueObjects/ProductQuantity';
import AddAnItemCommand from '../Command/AddAnItemCommand';
import Checkout from '../../../../Core/Models/Domain Models/Checkout/Checkout';

@CommandHandler(AddItemOneMoreThanCommand)
export default class AddItemOneMoreThanCommandHandler implements ICommandHandler<AddItemOneMoreThanCommand> {
    
    constructor(
        @Inject("CheckoutRepository") 
        private readonly checkoutWriteRepository: CheckoutRepository,
        private eventPublisher: EventPublisher
        ){
    }
    async execute(command: AddItemOneMoreThanCommand): Promise<any> {
        const checkoutDomainModel = await this.checkoutWriteRepository.findOneByUuidAndCustomerUuid(command.checkoutUuid, command.customerUuid)
        if(checkoutDomainModel.isNull()) {
            await this.ifDomainModelNotExistExecuteThis(command)
        }
        if(checkoutDomainModel.isNotNull()) {
            await this.ifDomainModelExistExecuteThis(checkoutDomainModel as Checkout, command)
        }

    }
    
    
    
    
    
    private async ifDomainModelExistExecuteThis(checkoutDomainModel: Checkout, command: AddItemOneMoreThanCommand){
        checkoutDomainModel.addItemOneMoreThan(
            new CheckoutItemID(command.checkoutItemUuid), 
            new ProductQuantity(command.quantity)
        )
        
        await this.checkoutWriteRepository.saveChanges(checkoutDomainModel as Checkout)

    }
    private async ifDomainModelNotExistExecuteThis(command: AddItemOneMoreThanCommand){
        const newCheckoutDomainModel = CheckoutBuilder.initBuilder(new FromCreationalCommandCheckoutBuilderState)
                                                    .checkoutUuid(() => new CheckoutID(command.checkoutUuid))
                                                    .userUuid(() => new CustomerID(command.customerUuid))
                                                    .checkoutState(() => new CheckoutState(CheckoutStates.CHECKOUT_CREATED))
                                                    .subTotal(() => new Money(command.productBasePrice))
                                                    .createdAt(new Date)
                                                    .updatedAt(new Date)
                                                    .build()

        const checkoutItemDomainModel = CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState)
                                                    .checkoutItemUuid(() => new CheckoutItemID(command.checkoutItemUuid))
                                                    .checkoutUuid(() => new CheckoutID(command.checkoutUuid))
                                                    .checkoutProductUuid(() => new ProductID(command.productUuid))
                                                    .checkoutProductBasePrice(() => new Money(command.productBasePrice))
                                                    .checkoutProductHeader(() => new ProductHeader(command.productHeader))
                                                    .checkoutProductQuantity(() => new ProductQuantity(1))
                                                    .checkoutCreatedAt(new Date)
                                                    .checkoutUpdatedAt(new Date)
                                                    .build()
        
        newCheckoutDomainModel.addAnItem(checkoutItemDomainModel)

        newCheckoutDomainModel.addItemOneMoreThan(
            new CheckoutItemID(checkoutItemDomainModel.getUuid().getUuid()),
            new ProductQuantity(command.quantity - 1)
        )               
        await this.checkoutWriteRepository.saveChanges(newCheckoutDomainModel as Checkout)

    }

}
    
