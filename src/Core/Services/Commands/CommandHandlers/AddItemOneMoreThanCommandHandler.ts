import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import AddItemOneMoreThanCommand from '../Command/AddItemOneMoreThanCommand';
import CheckoutRepository from '../../../Interfaces/CheckoutRepository';
import { Inject } from '@nestjs/common';
import CheckoutItemID from '../../../../Core/Models/ValueObjects/CheckoutItemID';
import ProductQuantity from '../../../../Core/Models/ValueObjects/ProductQuantity';
import Checkout from '../../../../Core/Models/Domain Models/Checkout/Checkout';
import { IDomainModelFactoryContext } from '../../../Models/Factories/DomainModelFactoryContext';
import CheckoutNotFound from '../../../../Core/Exceptions/CheckoutNotFound';
import SuccessResult from 'src/Core/Models/Result/SuccsessResult';

@CommandHandler(AddItemOneMoreThanCommand)
export default class AddItemOneMoreThanCommandHandler implements ICommandHandler<AddItemOneMoreThanCommand> {
    
    constructor(
        @Inject("CheckoutRepository") 
        private readonly checkoutWriteRepository: CheckoutRepository,
        @Inject("DomainModelFactoryContext")
        private readonly domainModelFactoryContext: IDomainModelFactoryContext,
        private readonly eventPublisher: EventPublisher,
        ){
    }
    async execute(command: AddItemOneMoreThanCommand): Promise<any> {
        const checkoutDomainModel = await this.checkoutWriteRepository.findOneByUuidAndCustomerUuid(command.checkoutUuid, command.customerUuid) 
        if(checkoutDomainModel.isNull()) throw new CheckoutNotFound()
        
        checkoutDomainModel.isCheckoutCancelled()
        
        checkoutDomainModel.addItemOneMoreThan(
            new CheckoutItemID(command.checkoutItemUuid), 
            new ProductQuantity(command.quantity)
        )
        
        this.checkoutWriteRepository.saveChanges(checkoutDomainModel as Checkout)
        this.eventPublisher.mergeObjectContext(checkoutDomainModel as Checkout).commit()
        return new SuccessResult({
            checkout_item_uuid: command.checkoutItemUuid,
            checkout_quantity: command.quantity
        })
    }

}
    

    
