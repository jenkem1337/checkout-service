import { CommandHandler, EventBus, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import AddItemOneMoreThanCommand from '../Command/AddItemOneMoreThanCommand';
import CheckoutRepository from '../../../Interfaces/CheckoutRepository';
import { Inject } from '@nestjs/common';
import CheckoutInterface from '../../../../Core/Models/Domain Models/Checkout/CheckoutInterface';
import CheckoutItemID from '../../../../Core/Models/ValueObjects/CheckoutItemID';
import { CheckoutStates } from '../../../../Core/Models/ValueObjects/CheckoutState';
import ProductQuantity from '../../../../Core/Models/ValueObjects/ProductQuantity';
import Checkout from '../../../../Core/Models/Domain Models/Checkout/Checkout';
import FromCheckoutCreatedFactory from '../../../Models/Factories/Checkout/FromCheckoutCreatedFactory';
import CheckoutConstructorParamaters from '../../../Models/Factories/Checkout/CheckoutConstructorParameters';
import { IDomainModelFactoryContext } from '../../../Models/Factories/DomainModelFactoryContext';
import CheckoutItemInterface from '../../../Models/Domain Models/Checkout/CheckoutItemInterface';
import CheckoutItemConstructorParameters from '../../../Models/Factories/CheckoutItem/CheckoutItemConstructorParameters';
import ConcreateCheckoutItemFactory from '../../../Models/Factories/CheckoutItem/ConcreateCheckoutItem';
import CreateNewCheckoutAndAddNewCheckoutItemEvent from '../../Events/CheckoutCreatedAndOneCheckoutItemAddedEvent';
import { check } from 'prettier';
import CheckoutCreatedAndItemAddedOneMoreThanEvent from '../../Events/CheckoutCreatedAndItemAddedOneMoreThanEvent';

@CommandHandler(AddItemOneMoreThanCommand)
export default class AddItemOneMoreThanCommandHandler implements ICommandHandler<AddItemOneMoreThanCommand> {
    
    constructor(
        @Inject("CheckoutRepository") 
        private readonly checkoutWriteRepository: CheckoutRepository,
        @Inject("DomainModelFactoryContext")
        private readonly domainModelFactoryContext: IDomainModelFactoryContext,
        private readonly eventPublisher: EventPublisher,
        private readonly eventBus: EventBus
        ){
    }
    async execute(command: AddItemOneMoreThanCommand): Promise<any> {
        const checkoutDomainModel = await this.checkoutWriteRepository.findOneByUuidAndCustomerUuid(command.checkoutUuid, command.customerUuid) 
        
        if(checkoutDomainModel.isNull()) {
            await this.createCheckoutAndAddCheckoutItems(command)
        }
        
        if(checkoutDomainModel.isNotNull()) {
            await this.addCheckoutItems(checkoutDomainModel as Checkout, command)
        }
    }
    
    
    
    
    
    private async addCheckoutItems(checkoutDomainModel: Checkout, command: AddItemOneMoreThanCommand){
        checkoutDomainModel.addItemOneMoreThan(
            new CheckoutItemID(command.checkoutItemUuid), 
            new ProductQuantity(command.quantity)
        )
        
        await this.checkoutWriteRepository.saveChanges(checkoutDomainModel as Checkout)
        this.eventPublisher.mergeObjectContext(checkoutDomainModel).commit()

    }
    private async createCheckoutAndAddCheckoutItems(command: AddItemOneMoreThanCommand){
        const newCheckoutDomainModel = this.domainModelFactoryContext.setFactoryMethod(FromCheckoutCreatedFactory.name)
                                                                    .createInstance<CheckoutInterface, CheckoutConstructorParamaters>({
                                                                        checkoutState:CheckoutStates.CHECKOUT_CREATED,
                                                                        checkoutUuid:command.checkoutUuid,
                                                                        createdAt:new Date,
                                                                        updatedAt:new Date,
                                                                        subTotal: 0,
                                                                        userUuid: command.customerUuid,
                                                                    })   
        const checkoutItem = this.domainModelFactoryContext.setFactoryMethod(ConcreateCheckoutItemFactory.name)
                                                          .createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({
                                                              checkoutItemUuid: command.checkoutItemUuid,
                                                              checkoutUuid: command.checkoutUuid,
                                                              createdAt: new Date,
                                                              productBasePrice:command.productBasePrice,
                                                              productHeader:command.productHeader,
                                                              productQuantity: 1,
                                                              productUuid: command.productUuid,
                                                              updatedAt: new Date
                                                          })
            
        
        newCheckoutDomainModel.addAnItem(checkoutItem)

        newCheckoutDomainModel.addItemOneMoreThan(
            new CheckoutItemID(checkoutItem.getUuid().getUuid()),
            new ProductQuantity(command.quantity - 1)
        )               
        await this.checkoutWriteRepository.saveChanges(newCheckoutDomainModel as Checkout)
        
        this.eventBus.publish(new CheckoutCreatedAndItemAddedOneMoreThanEvent ({
            checkoutCreatedDate:newCheckoutDomainModel.getCreatedAt(),
            checkoutItemUuid:checkoutItem.getUuid().getUuid(),
            checkoutState: newCheckoutDomainModel.getCheckoutState().getState(),
            checkoutSubTotal: newCheckoutDomainModel.getSubTotal().getAmount(),
            checkoutUpdatedDate: newCheckoutDomainModel.getUpdatedAt(),
            checkoutUuid: newCheckoutDomainModel.getUuid().getUuid(),
            customerUuid: newCheckoutDomainModel.getUserUuid().getUuid(),
            itemCreatedDate:checkoutItem.getCreatedAt(),
            itemUpdatedDate:checkoutItem.getUpdatedAt(),
            productBasePrice:checkoutItem.getProductBasePrice().getAmount(),
            productHeader: checkoutItem.getProductHeader().getHeader(),
            productUuid: checkoutItem.getProductUuid().getUuid(),
            quantity: checkoutItem.getProductQuantity().getQuantity()
        }))
    }

}
    
