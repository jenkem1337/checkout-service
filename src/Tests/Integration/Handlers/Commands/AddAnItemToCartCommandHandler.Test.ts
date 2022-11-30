import StubAddAnItemToCartCommandHandler from '../../../Stubs/Handlers/Commands/StubAddAnItemToCartCommandHandler';
import CheckoutRepository from '../../../../Core/Interfaces/CheckoutRepository';
import { Test } from '@nestjs/testing';
import InMemoryCheckoutRepositoryImpl from '../../../../Infrastructure/Repository/InMemoryCheckoutRepositoryImpl';
import { testORMProvider } from '../../../../Application/Modules/ORMModule/OrmProvider';
import { CqrsModule } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import AddAnItemCommand from '../../../../Core/Services/Commands/Command/AddAnItemCommand';
import { CheckoutStates } from '../../../../Core/Models/ValueObjects/CheckoutState';
describe("AddAnItemToCartCommandHandler", () => {
    let commandHandler: StubAddAnItemToCartCommandHandler
    let repository: InMemoryCheckoutRepositoryImpl

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CqrsModule],
            providers: [StubAddAnItemToCartCommandHandler, {
                provide: InMemoryCheckoutRepositoryImpl.name,
                useClass: InMemoryCheckoutRepositoryImpl
            }, ...testORMProvider]
        }).compile()

        commandHandler = moduleRef.get(StubAddAnItemToCartCommandHandler)
        repository = moduleRef.get(InMemoryCheckoutRepositoryImpl.name)
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