import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import AddAnItemCommand from '../Command/AddAnItemCommand';
import CheckoutRepository from '../../../Interfaces/CheckoutRepository';
import { Inject } from '@nestjs/common';
import CheckoutBuilder from '../../../../Core/Models/Builders/CheckoutBuilder';
import FromCreationalCommandCheckoutBuilderState from '../../../../Core/Models/Builders/States/CheckoutAggregateStates/FromCommandCheckoutBuilderState';
import CheckoutID from '../../../../Core/Models/ValueObjects/CheckoutID';
import CheckoutState from '../../../../Core/Models/ValueObjects/CheckoutState';
import CustomerID from '../../../../Core/Models/ValueObjects/CustomerID';
import Money from '../../../../Core/Models/ValueObjects/Money';
import { CheckoutStates } from '../../../Models/ValueObjects/CheckoutState';
import CheckoutItemBuilder from '../../../Models/Builders/CheckoutItemBuilder';
import ItMustBeConcreateCheckoutItemState from '../../../Models/Builders/States/CheckoutItemStates/ItMustBeConcreateCheckoutItemState';
import CheckoutItemID from '../../../../Core/Models/ValueObjects/CheckoutItemID';
import ProductHeader from '../../../Models/ValueObjects/ProductHeader';
import ProductQuantity from '../../../Models/ValueObjects/ProductQuantity';
import Checkout from '../../../Models/Domain Models/Checkout/Checkout';
import ProductID from '../../../Models/ValueObjects/ProductID';
import CheckoutInterface from '../../../Models/Domain Models/Checkout/CheckoutInterface';
import { check } from 'prettier';

@CommandHandler(AddAnItemCommand)
export default class AddAnItemToCartCommadHandler implements ICommandHandler<AddAnItemCommand> {
    private readonly checkoutWriteRepository: CheckoutRepository
    private readonly eventPublisher: EventPublisher
    constructor(
            @Inject("CheckoutRepository") writeRepository:CheckoutRepository,
            eventPublisher: EventPublisher
        ) {
        this.checkoutWriteRepository = writeRepository
        this.eventPublisher = eventPublisher
    }
    async execute(command: AddAnItemCommand): Promise<any> {
        const checkoutDomainModel = await this.checkoutWriteRepository.findOneByUuidAndCustomerUuid(command.checkoutUuid, command.customerUuid)
        if(checkoutDomainModel.isNull()) {
            await this.createCheckoutAndAddAnCheckoutItem(command)
        }
        if(checkoutDomainModel.isNotNull()) {
            await this.addAnCheckoutItem(checkoutDomainModel, command)
        }
    }
    private async addAnCheckoutItem(checkoutDomainModel: CheckoutInterface, command: AddAnItemCommand){
        checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState)
                                                    .checkoutItemUuid(() => new CheckoutItemID(command.checkoutItemUuid))
                                                    .checkoutUuid(() => new CheckoutID(command.checkoutUuid))
                                                    .checkoutProductUuid(() => new ProductID(command.productUuid))
                                                    .checkoutProductBasePrice(() => new Money(command.productBasePrice))
                                                    .checkoutProductHeader(() => new ProductHeader(command.productHeader))
                                                    .checkoutProductQuantity(() => new ProductQuantity(command.quantity))
                                                    .checkoutCreatedAt(command.itemCreatedDate)
                                                    .checkoutUpdatedAt(command.itemUpdatedDate)
                                                    .build())
        await this.checkoutWriteRepository.saveChanges(checkoutDomainModel as Checkout)
        this.eventPublisher.mergeObjectContext(checkoutDomainModel as Checkout).commit()
    }
    private async createCheckoutAndAddAnCheckoutItem(command: AddAnItemCommand){
        const newCheckoutDomainModel = CheckoutBuilder.initBuilder(new FromCreationalCommandCheckoutBuilderState)
        .checkoutUuid(() => new CheckoutID(command.checkoutUuid))
        .userUuid(() => new CustomerID(command.customerUuid))
        .checkoutState(() => new CheckoutState(CheckoutStates.CHECKOUT_CREATED))
        .subTotal(() => new Money(command.productBasePrice))
        .createdAt(new Date)
        .updatedAt(new Date)
        .build()

        newCheckoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState)
                                                    .checkoutItemUuid(() => new CheckoutItemID(command.checkoutItemUuid))
                                                    .checkoutUuid(() => new CheckoutID(command.checkoutUuid))
                                                    .checkoutProductUuid(() => new ProductID(command.productUuid))
                                                    .checkoutProductBasePrice(() => new Money(command.productBasePrice))
                                                    .checkoutProductHeader(() => new ProductHeader(command.productHeader))
                                                    .checkoutProductQuantity(() => new ProductQuantity(command.quantity))
                                                    .checkoutCreatedAt(command.itemCreatedDate)
                                                    .checkoutUpdatedAt(command.itemUpdatedDate)
                                                    .build())
        await this.checkoutWriteRepository.saveChanges(newCheckoutDomainModel as Checkout)
        
        this.eventPublisher.mergeObjectContext(newCheckoutDomainModel as Checkout).commit()

    }

}