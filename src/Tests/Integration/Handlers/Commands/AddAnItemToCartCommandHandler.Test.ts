
import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

import AddAnItemCommand from '../../../../Core/Services/Commands/Command/AddAnItemCommand';
import CheckoutAggregateMapperContext from '../../../../Infrastructure/Repository/Mapper/CheckoutAggregateMapperContext';
import WriteCheckoutAggregateMapper from '../../../../Infrastructure/Repository/Mapper/WriteCheckoutAggregateMapper';
import AddAnItemToCartCommandHandler from '../../../../Core/Services/Commands/CommandHandlers/AddAnItemToCartCommandHandler';
import CheckoutRepositoryImpl from '../../../../Infrastructure/Repository/CheckoutRepositoryImpl';
import { DataSource } from 'typeorm';
import CheckoutDataMapper from '../../../../Infrastructure/Entity/CheckoutDataMapper';
import CheckoutItemDataMapper from '../../../../Infrastructure/Entity/CheckoutItemDataMapper';
import DomainModelFactoryContext, { IDomainModelFactoryContext } from '../../../../Core/Models/Factories/DomainModelFactoryContext';
import NullableCheckoutFactory from '../../../../Core/Models/Factories/Checkout/NullableCheckoutFactory';
import ConcreteCheckoutFactory from '../../../../Core/Models/Factories/Checkout/ConcreteCheckoutFactory';
import ConcreateCheckoutItemFactory from '../../../../Core/Models/Factories/CheckoutItem/ConcreateCheckoutItem';
import NullableCheckoutItemFactory from '../../../../Core/Models/Factories/CheckoutItem/NullableCheckoutItemFactory';
import ConcreateAllArgumentCheckoutFactory from '../../../../Core/Models/Factories/Checkout/ConcreateAllArgumentCheckoutFactory';
import { CheckoutStates } from '../../../../Core/Models/ValueObjects/CheckoutState';
import NullableAllArgumentCheckoutFactory from '../../../../Core/Models/Factories/Checkout/NullableAllArgumentCheckoutFactory';
import TransactionalCommandHandler from '../../../../Core/Services/Commands/CommandHandlers/TransactionalCommandHandler';
import TransactionalCommand from '../../../../Core/Services/Commands/Command/TransactionalCommand';
describe("AddAnItemToCartCommandHandler", () => {
    let commandBus: CommandBus
    let repository: CheckoutRepositoryImpl
    let factoryCtx: IDomainModelFactoryContext
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CqrsModule],
            providers: [
                TransactionalCommandHandler,
                AddAnItemToCartCommandHandler,
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

        commandBus = moduleRef.get(CommandBus)
        repository = moduleRef.get("CheckoutRepository")
        factoryCtx = moduleRef.get("DomainModelFactoryContext")

        commandBus.register([
            AddAnItemToCartCommandHandler, TransactionalCommandHandler
        ])
    })

    afterEach(() => {
        repository = null
        commandBus = null
    })


    it('should persist CheckoutItem via Checkout Aggregate when Checkout Aggregate allready exist', async  () => {
        const checkoutUuid = randomUUID()
        const customerUuid = randomUUID()
        const itemUuid = randomUUID()
        await repository.saveChanges(factoryCtx.setFactoryMethod(ConcreteCheckoutFactory.name)
                                            .createInstance({
                                                checkoutUuid: checkoutUuid,
                                                userUuid: customerUuid,
                                                checkoutState: CheckoutStates.CHECKOUT_CREATED,
                                                createdAt: new Date,
                                                subTotal: 0,
                                                updatedAt: new Date
                                            }))


        await commandBus.execute(new AddAnItemCommand(checkoutUuid, customerUuid, itemUuid, randomUUID(), "Product 1", 120, new Date, new Date))
        await commandBus.execute(new AddAnItemCommand(checkoutUuid, customerUuid, itemUuid, randomUUID(), "Product 1", 120, new Date, new Date))

        let _checkout = await repository.findOneByUuidAndCustomerUuid(checkoutUuid, customerUuid)
        let _checkoutItem = _checkout.getCheckoutItems().get(itemUuid)
        expect(_checkoutItem.getProductQuantity().getQuantity()).toBe(2)
        expect(_checkout.getSubTotal().getAmount()).toBe(240)
    })
    it("should persist Checkout Item with TransactionalCommandHandler", async () => {
        const checkoutUuid = randomUUID()
        const customerUuid = randomUUID()
        const itemUuid = randomUUID()
        await repository.saveChanges(factoryCtx.setFactoryMethod(ConcreteCheckoutFactory.name)
                                            .createInstance({
                                                checkoutUuid: checkoutUuid,
                                                userUuid: customerUuid,
                                                checkoutState: CheckoutStates.CHECKOUT_CREATED,
                                                createdAt: new Date,
                                                subTotal: 0,
                                                updatedAt: new Date
                                            }))
        await commandBus.execute(new TransactionalCommand<AddAnItemCommand>(
            new AddAnItemCommand(checkoutUuid, customerUuid, itemUuid, randomUUID(), "Product 1", 120, new Date, new Date)))
            
            let _checkout = await repository.findOneByUuidAndCustomerUuid(checkoutUuid, customerUuid)
            let _checkoutItem = _checkout.getCheckoutItems().get(itemUuid)
            expect(_checkoutItem.getProductQuantity().getQuantity()).toBe(1)
            expect(_checkout.getSubTotal().getAmount()).toBe(120)
    
    })
})