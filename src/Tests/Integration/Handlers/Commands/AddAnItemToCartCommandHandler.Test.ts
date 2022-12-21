
import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import AddAnItemCommand from '../../../../Core/Services/Commands/Command/AddAnItemCommand';
import { CheckoutStates } from '../../../../Core/Models/ValueObjects/CheckoutState';
import CheckoutAggregateMapperContext from '../../../../Infrastructure/Repository/Mapper/CheckoutAggregateMapperContext';
import WriteCheckoutAggregateMapper from '../../../../Infrastructure/Repository/Mapper/WriteCheckoutAggregateMapper';
import AddAnItemToCartCommandHandler from '../../../../Core/Services/Commands/CommandHandlers/AddAnItemToCartCommandHandler';
import CheckoutRepositoryImpl from '../../../../Infrastructure/Repository/CheckoutRepositoryImpl';
import { DataSource } from 'typeorm';
import CheckoutDataMapper from '../../../../Infrastructure/Entity/CheckoutDataMapper';
import CheckoutItemDataMapper from '../../../../Infrastructure/Entity/CheckoutItemDataMapper';
describe("AddAnItemToCartCommandHandler", () => {
    let commandHandler: AddAnItemToCartCommandHandler
    let repository: CheckoutRepositoryImpl

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CqrsModule],
            providers: [
                AddAnItemToCartCommandHandler,
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
                    useFactory: () => {
                        const context = new CheckoutAggregateMapperContext
                        context.setStrategy( new WriteCheckoutAggregateMapper)
                        return context;
                    }
                }
            ]
        }).compile()

        commandHandler = moduleRef.get(AddAnItemToCartCommandHandler)
        repository = moduleRef.get("CheckoutRepository")
    })

    afterEach(() => {
        commandHandler = null
        repository = null
    })

    it('should persist CheckoutItem via Checkout Aggregate when Checkout Aggregate doesnt exist', async () => {
        const checkoutUuid = randomUUID()
        const customerUuid = randomUUID()
        await commandHandler.execute(new AddAnItemCommand(checkoutUuid, customerUuid, randomUUID(), randomUUID(), "Product 1", 120, new Date, new Date))

        let _checkout = await repository.findOneByUuid(checkoutUuid)
        expect(_checkout.getSubTotal().getAmount()).toBe(120)
        expect(_checkout.getCheckoutItems().size).toBe(1)
        expect(_checkout.getCheckoutState().getState()).toBe(CheckoutStates.CHECKOUT_CREATED)
    })

    it('should persist CheckoutItem via Checkout Aggregate when Checkout Aggregate allready exist', async  () => {
        const checkoutUuid = randomUUID()
        const customerUuid = randomUUID()
        const itemUuid = randomUUID()
        await commandHandler.execute(new AddAnItemCommand(checkoutUuid, customerUuid, itemUuid, randomUUID(), "Product 1", 120, new Date, new Date))
        await commandHandler.execute(new AddAnItemCommand(checkoutUuid, customerUuid, itemUuid, randomUUID(), "Product 1", 120, new Date, new Date))

        let _checkout = await repository.findOneByUuidAndCustomerUuid(checkoutUuid, customerUuid)
        let _checkoutItem = _checkout.getCheckoutItems().get(itemUuid)
        expect(_checkoutItem.getProductQuantity().getQuantity()).toBe(2)
        expect(_checkout.getSubTotal().getAmount()).toBe(240)
    })
})