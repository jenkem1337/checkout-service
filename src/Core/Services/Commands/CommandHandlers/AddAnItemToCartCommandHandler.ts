import { CommandHandler, ICommandHandler, EventPublisher, EventBus } from '@nestjs/cqrs';
import AddAnItemCommand from '../Command/AddAnItemCommand';
import CheckoutRepository from '../../../Interfaces/CheckoutRepository';
import { Inject } from '@nestjs/common';
import Checkout from '../../../Models/Domain Models/Checkout/Checkout';
import CheckoutInterface from '../../../Models/Domain Models/Checkout/CheckoutInterface';
import { IDomainModelFactoryContext } from '../../../Models/Factories/DomainModelFactoryContext';
import ConcreateCheckoutItemFactory from '../../../Models/Factories/CheckoutItem/ConcreateCheckoutItem';
import CheckoutItemInterface from '../../../Models/Domain Models/Checkout/CheckoutItemInterface';
import CheckoutItemConstructorParameters from 'src/Core/Models/Factories/CheckoutItem/CheckoutItemConstructorParameters';
import CheckoutNotFound from 'src/Core/Exceptions/CheckoutNotFound';
import MessageQueue from '../../../../Infrastructure/Queue/MessageQueue';
import { randomUUID } from 'crypto';
import SuccessResult from 'src/Core/Models/Result/SuccsessResult';
interface ProductResponse {
    header: string,
    price: number,
    hasError: boolean
    errorMessage?: string; 
}
@CommandHandler(AddAnItemCommand)
export default class AddAnItemToCartCommadHandler implements ICommandHandler<AddAnItemCommand> {
    constructor(
        @Inject("CheckoutRepository") 
        private readonly checkoutWriteRepository: CheckoutRepository,
        @Inject("DomainModelFactoryContext") 
        private readonly domainModelFactoryContext: IDomainModelFactoryContext,
        @Inject("MessageQueue")
        private readonly messageQueue: MessageQueue,
        private readonly eventPublisher: EventPublisher
    ){}
    async execute(command: AddAnItemCommand): Promise<any> {
        const checkoutDomainModel = await this.checkoutWriteRepository.findOneByUuidAndCustomerUuid(command.checkoutUuid, command.customerUuid)
        
        if(checkoutDomainModel.isNull()) throw new CheckoutNotFound()
        //if checkout cancelled it will throw exception
        checkoutDomainModel.isCheckoutCancelled()
        
        await this.messageQueue.publishMessage("find-one-product-by-uuid", command.productUuid)
        const productResponseFromProductService = await this.messageQueue.getResponseFromQueue<ProductResponse>("one-product-founded")
        
        if(productResponseFromProductService.hasError) {
            throw new Error(productResponseFromProductService.errorMessage)
        }

        const checkoutItem = this.domainModelFactoryContext
                                                    .setFactoryMethod(ConcreateCheckoutItemFactory.name)
                                                    .createInstance
                                                            <CheckoutItemInterface, CheckoutItemConstructorParameters>
                                                    ({
                                                        checkoutItemUuid: command.checkoutItemUuid ?? randomUUID(),
                                                        checkoutUuid: command.checkoutUuid,
                                                        createdAt: new Date,
                                                        productBasePrice:productResponseFromProductService.price,
                                                        productHeader:productResponseFromProductService.header,
                                                        productQuantity: command.quantity,
                                                        productUuid: command.productUuid,
                                                        updatedAt: new Date
                                                    })
        checkoutDomainModel.addAnItem(checkoutItem)
        this.checkoutWriteRepository.saveChanges(checkoutDomainModel as Checkout)
        this.eventPublisher.mergeObjectContext(checkoutDomainModel as Checkout).commit()
        return new SuccessResult({
            checkout_item_uuid: checkoutItem.getUuid().getUuid()
        })
    }
}