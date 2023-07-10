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
        ) {
        this.checkoutWriteRepository = writeRepository
        this.domainModelFactoryContext = domainModelFactoryContext
        this.eventPublisher = eventPublisher
    }
    async execute(command: AddAnItemCommand): Promise<any> {
        const checkoutDomainModel = await this.checkoutWriteRepository.findOneByUuidAndCustomerUuid(command.checkoutUuid, command.customerUuid)
        
        if(checkoutDomainModel.isNotNull()) {
            await this.addAnCheckoutItem(checkoutDomainModel, command)
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
        this.checkoutWriteRepository.saveChanges(checkoutDomainModel as Checkout)
        this.eventPublisher.mergeObjectContext(checkoutDomainModel as Checkout).commit()
    }
}