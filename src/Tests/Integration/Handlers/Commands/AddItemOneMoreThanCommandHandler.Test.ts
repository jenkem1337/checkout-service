import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import AddItemOneMoreThanCommand from '../../../../Core/Services/Commands/Command/AddItemOneMoreThanCommand';
import Checkout from '../../../../Core/Models/Domain Models/Checkout/Checkout';
import CheckoutID from '../../../../Core/Models/ValueObjects/CheckoutID';
import CustomerID from '../../../../Core/Models/ValueObjects/CustomerID';
import Money from '../../../../Core/Models/ValueObjects/Money';
import CheckoutState from '../../../../Core/Models/ValueObjects/CheckoutState';
import { CheckoutStates } from '../../../../Core/Models/ValueObjects/CheckoutState';
import CheckoutItemInterface from '../../../../Core/Models/Domain Models/Checkout/CheckoutItemInterface';
import CheckoutItem from '../../../../Core/Models/Domain Models/Checkout/CheckoutItem';
import CheckoutItemID from '../../../../Core/Models/ValueObjects/CheckoutItemID';
import ProductID from '../../../../Core/Models/ValueObjects/ProductID';
import ProductHeader from '../../../../Core/Models/ValueObjects/ProductHeader';
import ProductQuantity from '../../../../Core/Models/ValueObjects/ProductQuantity';
import CheckoutAggregateMapperContext from '../../../../Infrastructure/Repository/Mapper/CheckoutAggregateMapperContext';
import WriteCheckoutAggregateMapper from '../../../../Infrastructure/Repository/Mapper/WriteCheckoutAggregateMapper';
import CheckoutDataMapper from '../../../../Infrastructure/Entity/CheckoutDataMapper';
import CheckoutItemDataMapper from '../../../../Infrastructure/Entity/CheckoutItemDataMapper';
import { DataSource } from 'typeorm';
import CheckoutRepositoryImpl from '../../../../Infrastructure/Repository/CheckoutRepositoryImpl';
import AddItemOneMoreThanCommandHandler from '../../../../Core/Services/Commands/CommandHandlers/AddItemOneMoreThanCommandHandler';
import NullableCheckoutFactory from '../../../../Core/Models/Factories/Checkout/NullableCheckoutFactory';
import ConcreteCheckoutFactory from '../../../../Core/Models/Factories/Checkout/ConcreteCheckoutFactory';
import ConcreateCheckoutItemFactory from '../../../../Core/Models/Factories/CheckoutItem/ConcreateCheckoutItem';
import NullableCheckoutItemFactory from '../../../../Core/Models/Factories/CheckoutItem/NullableCheckoutItemFactory';
import ConcreateAllArgumentCheckoutFactory from '../../../../Core/Models/Factories/Checkout/ConcreateAllArgumentCheckoutFactory';
import NullableAllArgumentCheckoutFactory from '../../../../Core/Models/Factories/Checkout/NullableAllArgumentCheckoutFactory';
import DomainModelFactoryContext from '../../../../Core/Models/Factories/DomainModelFactoryContext';
import { IDomainModelFactoryContext } from '../../../../Core/Models/Factories/DomainModelFactoryContext';
import TransactionalCommandHandler from '../../../../Core/Services/Commands/CommandHandlers/TransactionalCommandHandler';
import TransactionalCommand from '../../../../Core/Services/Commands/Command/TransactionalCommand';

describe("AddItemOneMoreThanCommandHandler", () => {
    let commandBus: CommandBus
    let repository: CheckoutRepositoryImpl

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CqrsModule],
            providers: [
                TransactionalCommandHandler,
                AddItemOneMoreThanCommandHandler,
                {
                    provide:"DomainModelFactoryContext",
                    useFactory: () => {
                        const factoryCtx: IDomainModelFactoryContext = new DomainModelFactoryContext()
                        factoryCtx.addFactoryClass(NullableCheckoutFactory.name, new NullableCheckoutFactory())
                                .addFactoryClass(ConcreteCheckoutFactory.name, new ConcreteCheckoutFactory)
                                .addFactoryClass(ConcreateCheckoutItemFactory.name, new ConcreateCheckoutItemFactory)
                                .addFactoryClass(NullableCheckoutItemFactory.name, new NullableCheckoutItemFactory)
                                .addFactoryClass(ConcreateAllArgumentCheckoutFactory.name, new ConcreateAllArgumentCheckoutFactory())
                                .addFactoryClass(NullableAllArgumentCheckoutFactory.name, new NullableAllArgumentCheckoutFactory)
                            return factoryCtx
                    }
                },

                {
                    provide:"CheckoutRepository",
                    useClass: CheckoutRepositoryImpl
                },
                {
                    provide: "DataSource",
                    useFactory: () => {
                        const dataSource = new DataSource({
                            type: 'sqlite',
                            database:':memory:',
                            entities: [
                                CheckoutDataMapper, CheckoutItemDataMapper
                            ],
                            synchronize: true,
                          });
                      
                          return dataSource.initialize();
                    }
                },
                {
                    provide: CheckoutAggregateMapperContext.name,
                    useFactory: (domainModelFactoryCtx: IDomainModelFactoryContext) => {
                        const context = new CheckoutAggregateMapperContext
                        context.setStrategy(new WriteCheckoutAggregateMapper(domainModelFactoryCtx))
                        return context;
                    },
                    inject: [{token: "DomainModelFactoryContext", optional:false}]
                }
            ]
        }).compile()
        repository = moduleRef.get("CheckoutRepository")
        commandBus = moduleRef.get(CommandBus)
        commandBus.register([
            AddItemOneMoreThanCommandHandler, TransactionalCommandHandler
        ])
    })

    it("should persist one more than item", async () => {
        const checkoutUuid = randomUUID()
        const customerUuid = randomUUID()
        const checkoutItemUuid = randomUUID()
        await repository.saveChanges(new Checkout(new CheckoutID(checkoutUuid),new CustomerID(customerUuid),new Money(100),new CheckoutState(CheckoutStates.CHECKOUT_CREATED),new Date,new Date,new Map<string, CheckoutItemInterface>([[checkoutItemUuid, new CheckoutItem(new CheckoutItemID(checkoutItemUuid), new CheckoutID(checkoutUuid), new ProductID(randomUUID()), new ProductHeader("Product 1"), new Money(100), new ProductQuantity(1), new Date, new Date)]])))
        
        await commandBus.execute(new AddItemOneMoreThanCommand(checkoutUuid, customerUuid, checkoutItemUuid, randomUUID(), "Product 1", 100, 4, new Date))
        let _checkout = await repository.findOneByUuidAndCustomerUuid(checkoutUuid, customerUuid)
        expect(_checkout.getSubTotal().getAmount()).toBe(500)
    })

    it("should persist not exist checkout item", async () => {
        const checkoutUuid = randomUUID()
        const customerUuid = randomUUID()
        await commandBus.execute(new AddItemOneMoreThanCommand(checkoutUuid, customerUuid, randomUUID(), randomUUID(), "Product 1", 100, 4, new Date))
        let _checkout = await repository.findOneByUuidAndCustomerUuid(checkoutUuid, customerUuid)

        expect(_checkout.getSubTotal().getAmount()).toBe(400)
    })

    it("should persist Checkout Item with TransactionalCommandHandler", async () => {
        const checkoutUuid = randomUUID()
        const customerUuid = randomUUID()
        const checkoutItemUuid = randomUUID()
        await repository.saveChanges(new Checkout(new CheckoutID(checkoutUuid),new CustomerID(customerUuid),new Money(100),new CheckoutState(CheckoutStates.CHECKOUT_CREATED),new Date,new Date,new Map<string, CheckoutItemInterface>([[checkoutItemUuid, new CheckoutItem(new CheckoutItemID(checkoutItemUuid), new CheckoutID(checkoutUuid), new ProductID(randomUUID()), new ProductHeader("Product 1"), new Money(100), new ProductQuantity(1), new Date, new Date)]])))
        await commandBus.execute(new TransactionalCommand(
            new AddItemOneMoreThanCommand(checkoutUuid, customerUuid, checkoutItemUuid, randomUUID(), "Product 1", 100, 4, new Date)))
        let _checkout = await repository.findOneByUuidAndCustomerUuid(checkoutUuid, customerUuid)
        expect(_checkout.getSubTotal().getAmount()).toBe(500)

    })
})