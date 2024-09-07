import { CommandHandler, ICommandHandler, EventPublisher, EventBus } from '@nestjs/cqrs';
import AddAnItemCommand from '../Command/AddAnItemCommand';
import { Inject } from '@nestjs/common';
import Checkout from '../../../Models/Domain Models/Checkout/Checkout';
import { IDomainModelFactoryContext } from '../../../Models/Factories/DomainModelFactoryContext';
import ConcreateCheckoutItemFactory from '../../../Models/Factories/CheckoutItem/ConcreateCheckoutItem';
import CheckoutItemInterface from '../../../Models/Domain Models/Checkout/CheckoutItemInterface';
import CheckoutItemConstructorParameters from 'src/Core/Models/Factories/CheckoutItem/CheckoutItemConstructorParameters';
import CheckoutNotFound from 'src/Core/Exceptions/CheckoutNotFound';
import { randomUUID } from 'crypto';
import SuccessResult from 'src/Core/Models/Result/SuccsessResult';
import ICheckoutRepositoryFactory from 'src/Core/Interfaces/ICheckoutRepositoryFactory';

@CommandHandler(AddAnItemCommand)
export default class AddAnItemToCartCommadHandler implements ICommandHandler<AddAnItemCommand> {
    constructor(
        @Inject("CheckoutRepositoryFactory") 
        private readonly checkoutRepositoryFactory: ICheckoutRepositoryFactory,
        @Inject("DomainModelFactoryContext") 
        private readonly domainModelFactoryContext: IDomainModelFactoryContext,
        private readonly eventPublisher: EventPublisher
    ){}
    async execute(command: AddAnItemCommand): Promise<any> {
            
            const checkoutWriteRepository = this.checkoutRepositoryFactory.createCheckoutRepository()
            const checkoutDomainModel = await checkoutWriteRepository.findOneByUuidAndCustomerUuid(command.checkoutUuid, command.customerUuid)
        
            if(checkoutDomainModel.isNull()) throw new CheckoutNotFound()
            //if checkout cancelled it will throw exception
            checkoutDomainModel.isCheckoutCancelled()
            
    
            const checkoutItem = this.domainModelFactoryContext
                                                        .setFactoryMethod(ConcreateCheckoutItemFactory.name)
                                                        .createInstance
                                                                <CheckoutItemInterface, CheckoutItemConstructorParameters>
                                                        ({
                                                            checkoutItemUuid: command.checkoutItemUuid ?? randomUUID(),
                                                            checkoutUuid: command.checkoutUuid,
                                                            createdAt: new Date,
                                                            productBasePrice:command.productBasePrice,
                                                            productHeader:command.productHeader,
                                                            productQuantity: command.quantity,
                                                            productUuid: command.productUuid,
                                                            updatedAt: new Date
                                                        })
            checkoutDomainModel.addAnItem(checkoutItem)
            await checkoutWriteRepository.saveChanges(checkoutDomainModel as Checkout)

            this.eventPublisher.mergeObjectContext(checkoutDomainModel as Checkout).commit()

            return new SuccessResult({
                checkout_item_uuid: checkoutItem.getUuid().getUuid()
            })
    
    }
}