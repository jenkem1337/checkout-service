import { CommandHandler, ICommandHandler, EventPublisher, EventBus } from '@nestjs/cqrs';
import AddAnItemCommand from '../Command/AddAnItemCommand';
import CheckoutRepository from '../../../Interfaces/CheckoutRepository';
import { Inject } from '@nestjs/common';
import { CheckoutStates } from '../../../Models/ValueObjects/CheckoutState';
import Checkout from '../../../Models/Domain Models/Checkout/Checkout';
import CheckoutInterface from '../../../Models/Domain Models/Checkout/CheckoutInterface';
import { IDomainModelFactoryContext } from '../../../Models/Factories/DomainModelFactoryContext';
import ConcreateCheckoutItemFactory from '../../../Models/Factories/CheckoutItem/ConcreateCheckoutItem';
import CheckoutItemInterface from '../../../Models/Domain Models/Checkout/CheckoutItemInterface';
import CheckoutItemConstructorParameters from 'src/Core/Models/Factories/CheckoutItem/CheckoutItemConstructorParameters';
import CheckoutConstructorParamaters from '../../../Models/Factories/Checkout/CheckoutConstructorParameters';
import { randomUUID } from 'crypto';
import CheckoutCreatedAndOneCheckoutItemAddedEvent from '../../Events/CheckoutCreatedAndOneCheckoutItemAddedEvent';
import ConcreteCheckoutFactory from '../../../Models/Factories/Checkout/ConcreteCheckoutFactory';

@CommandHandler(AddAnItemCommand)
export default class AddAnItemToCartCommadHandler implements ICommandHandler<AddAnItemCommand> {
    private readonly checkoutWriteRepository: CheckoutRepository
    private readonly eventPublisher: EventPublisher
    private readonly domainModelFactoryContext: IDomainModelFactoryContext
    private readonly eventBus: EventBus
    constructor(
            @Inject("CheckoutRepository") 
            writeRepository:CheckoutRepository,
            
            @Inject("DomainModelFactoryContext") 
            domainModelFactoryContext: IDomainModelFactoryContext,
            
            eventPublisher: EventPublisher,
            eventBus: EventBus
        ) {
        this.checkoutWriteRepository = writeRepository
        this.domainModelFactoryContext = domainModelFactoryContext
        this.eventPublisher = eventPublisher
        this.eventBus = eventBus
    }
    async execute(command: AddAnItemCommand): Promise<any> {
        const checkoutDomainModel = await this.checkoutWriteRepository.findOneByUuidAndCustomerUuid(command.checkoutUuid, command.customerUuid)
        
        if(checkoutDomainModel.isNotNull()) {
            await this.addAnCheckoutItem(checkoutDomainModel, command)
        }

        if(checkoutDomainModel.isNull()) {
            await this.createCheckoutAndAddAnCheckoutItem(command)
        }
    }
    private async addAnCheckoutItem(checkoutDomainModel: CheckoutInterface, command: AddAnItemCommand){
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
        checkoutDomainModel.addAnItem(checkoutItem)
        await this.checkoutWriteRepository.saveChanges(checkoutDomainModel as Checkout)
        this.eventPublisher.mergeObjectContext(checkoutDomainModel as Checkout).commit()
    }
    private async createCheckoutAndAddAnCheckoutItem(command: AddAnItemCommand){
        const newCheckoutDomainModel = this.domainModelFactoryContext.setFactoryMethod(ConcreteCheckoutFactory.name)
                                                                .createInstance<CheckoutInterface, CheckoutConstructorParamaters>({
                                                                    checkoutState:CheckoutStates.CHECKOUT_CREATED,
                                                                    checkoutUuid:randomUUID(),
                                                                    createdAt:new Date,
                                                                    updatedAt:new Date,
                                                                    subTotal: 0,
                                                                    userUuid: command.customerUuid,
                                                                })         
        const checkoutItem = this.domainModelFactoryContext.setFactoryMethod(ConcreateCheckoutItemFactory.name)
                                                        .createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({
                                                            checkoutItemUuid: command.checkoutItemUuid,
                                                            checkoutUuid: newCheckoutDomainModel.getUuid().getUuid(),
                                                            createdAt: command.itemCreatedDate,
                                                            productBasePrice:command.productBasePrice,
                                                            productHeader:command.productHeader,
                                                            productQuantity: command.quantity,
                                                            productUuid: command.productUuid,
                                                            updatedAt: command.itemUpdatedDate
                                                        })

        newCheckoutDomainModel.addAnItem(checkoutItem)
        await this.checkoutWriteRepository.saveChanges(newCheckoutDomainModel as Checkout)
        
        this.eventBus.publish(new CheckoutCreatedAndOneCheckoutItemAddedEvent({
            checkoutCreatedDate : newCheckoutDomainModel.getCreatedAt(),
            checkoutItemUuid    : checkoutItem.getUuid().getUuid(),
            checkoutState       : newCheckoutDomainModel.getCheckoutState().getState(),
            checkoutSubTotal    : newCheckoutDomainModel.getSubTotal().getAmount(),
            checkoutUpdatedDate : newCheckoutDomainModel.getUpdatedAt(),
            checkoutUuid        : newCheckoutDomainModel.getUuid().getUuid(),
            customerUuid        : newCheckoutDomainModel.getUserUuid().getUuid(),
            itemCreatedDate     :checkoutItem.getCreatedAt(),
            itemUpdatedDate     :checkoutItem.getUpdatedAt(),
            productBasePrice    :checkoutItem.getProductBasePrice().getAmount(),
            productHeader       : checkoutItem.getProductHeader().getHeader(),
            productUuid         : checkoutItem.getProductUuid().getUuid(),
            quantity            : checkoutItem.getProductQuantity().getQuantity()
        }))
    }

}