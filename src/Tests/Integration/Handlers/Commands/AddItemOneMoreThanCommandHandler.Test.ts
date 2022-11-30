import StubAddItemOneMoreThanCommandHandler from '../../../Stubs/Handlers/Commands/StubAddItemOneMoreThanCommandHandler';
import InMemoryCheckoutRepositoryImpl from '../../../../Infrastructure/Repository/InMemoryCheckoutRepositoryImpl';
import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { testORMProvider } from '../../../../Application/Modules/ORMModule/OrmProvider';
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

describe("AddItemOneMoreThanCommandHandler", () => {
    let commandHandler: StubAddItemOneMoreThanCommandHandler
    let inMemoryRepository: InMemoryCheckoutRepositoryImpl

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CqrsModule],
            providers: [{
                provide: InMemoryCheckoutRepositoryImpl.name,
                useClass: InMemoryCheckoutRepositoryImpl
            }, StubAddItemOneMoreThanCommandHandler, ...testORMProvider]
        }).compile()

        inMemoryRepository = moduleRef.get(InMemoryCheckoutRepositoryImpl.name)
        commandHandler = moduleRef.get(StubAddItemOneMoreThanCommandHandler)
    })

    it("should persist one more than item", async () => {
        const checkoutUuid = randomUUID()
        const customerUuid = randomUUID()
        const checkoutItemUuid = randomUUID()
        await inMemoryRepository.saveChanges(new Checkout(new CheckoutID(checkoutUuid),new CustomerID(customerUuid),new Money(100),new CheckoutState(CheckoutStates.CHECKOUT_CREATED),new Date,new Date,new Map<string, CheckoutItemInterface>([[checkoutItemUuid, new CheckoutItem(new CheckoutItemID(checkoutItemUuid), new CheckoutID(checkoutUuid), new ProductID(randomUUID()), new ProductHeader("Product 1"), new Money(100), new ProductQuantity(1), new Date, new Date)]])))
        
        await commandHandler.execute(new AddItemOneMoreThanCommand(checkoutUuid, customerUuid, checkoutItemUuid, randomUUID(), "Product 1", 100, 4, new Date))
        let _checkout = await inMemoryRepository.findOneByUuidAndCustomerUuid(checkoutUuid, customerUuid)
        expect(_checkout.getSubTotal().getAmount()).toBe(500)
    })

    it("should persist not exist checkout item", async () => {
        const checkoutUuid = randomUUID()
        const customerUuid = randomUUID()
        await commandHandler.execute(new AddItemOneMoreThanCommand(checkoutUuid, customerUuid, randomUUID(), randomUUID(), "Product 1", 100, 4, new Date))
        let _checkout = await inMemoryRepository.findOneByUuidAndCustomerUuid(checkoutUuid, customerUuid)

        expect(_checkout.getSubTotal().getAmount()).toBe(400)
    })
})