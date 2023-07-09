import  NullableCheckoutItemFactory  from '../../../Core/Models/Factories/CheckoutItem/NullableCheckoutItemFactory';
import  NullableAllArgumentCheckoutFactory from '../../../Core/Models/Factories/Checkout/NullableAllArgumentCheckoutFactory';
import  DomainModelFactoryContext  from '../../../Core/Models/Factories/DomainModelFactoryContext';
import { IDomainModelFactoryContext } from './../../../Core/Models/Factories/DomainModelFactoryContext';
import { Test } from '@nestjs/testing';
import Checkout from '../../../Core/Models/Domain Models/Checkout/Checkout';
import CheckoutID from '../../../Core/Models/ValueObjects/CheckoutID';
import { randomUUID } from 'crypto';
import CustomerID from '../../../Core/Models/ValueObjects/CustomerID';
import Money from '../../../Core/Models/ValueObjects/Money';
import CheckoutState, { CheckoutStates } from '../../../Core/Models/ValueObjects/CheckoutState';
import NullCheckout from '../../../Core/Models/Domain Models/Checkout/NullCheckout';
import CheckoutItem from '../../../Core/Models/Domain Models/Checkout/CheckoutItem';
import CheckoutItemID from '../../../Core/Models/ValueObjects/CheckoutItemID';
import ProductID from '../../../Core/Models/ValueObjects/ProductID';
import ProductHeader from '../../../Core/Models/ValueObjects/ProductHeader';
import ProductQuantity from '../../../Core/Models/ValueObjects/ProductQuantity';
import ReadCheckoutRepositoryImpl from '../../../Infrastructure/Repository/CheckoutReadRepositoryImpl';
import { MongoClient } from 'mongodb';
import CheckoutReadRepositoryImpl from '../../../Infrastructure/Repository/CheckoutReadRepositoryImpl';




describe('Read Checkout Repository', () => {
    let checkoutRepository: CheckoutReadRepositoryImpl = null
    
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CheckoutReadRepositoryImpl, {
                provide: 'MongoDataSource',
                useFactory: async () => {
                    const client = new MongoClient("mongodb://127.0.0.1:27017")
                    return client
                },
            },
        ]
        }).compile()

        checkoutRepository = await moduleRef.resolve<CheckoutReadRepositoryImpl>(CheckoutReadRepositoryImpl)
    })

    afterEach( async () => {
        checkoutRepository = null
    })

    it('should be save an instance of Checkout when called saveChanges', () => {
        expect(
            async () => await  checkoutRepository.saveChanges(new Checkout(new CheckoutID(randomUUID()), new CustomerID(randomUUID()), new Money(100), new CheckoutState(CheckoutStates.CHECKOUT_CREATED), new Date, new Date))
        ).toBeTruthy()
    })
    it('should retrieve NullCheckout when given absent uuid', async () => {
        await checkoutRepository.saveChanges(new Checkout(new CheckoutID(randomUUID()), new CustomerID(randomUUID()), new Money(100), new CheckoutState(CheckoutStates.CHECKOUT_CREATED), new Date, new Date))
        let checkoutAggregate: NullCheckout = await  checkoutRepository.findOneByUuid(randomUUID())
        expect(checkoutAggregate.isNull()).toBe(true)

    })
    it('should retrieve Checkout Aggregate when called findOneByUuid', async () => {
        const uuid = randomUUID()
        await checkoutRepository.saveChanges(new Checkout(new CheckoutID(uuid), new CustomerID(randomUUID()), new Money(100), new CheckoutState(CheckoutStates.CHECKOUT_CREATED), new Date, new Date))
        let checkoutAggregate = await  checkoutRepository.findOneByUuid(uuid)
        expect(checkoutAggregate.isNull()).toBe(false)
    })
    it('should retrieve Checkout Aggregate with Items when called findOneByUuid', async () => {
        const uuid = randomUUID()
        const _checkout = new Checkout(new CheckoutID(uuid), new CustomerID(randomUUID()), new Money(100), new CheckoutState(CheckoutStates.CHECKOUT_CREATED), new Date, new Date)
        _checkout.addAnItem(new CheckoutItem(new CheckoutItemID(randomUUID()), _checkout.getUuid(), new ProductID(randomUUID()), new ProductHeader("Product 1"), new Money(120), new ProductQuantity(2), new Date, new Date))
        _checkout.addAnItem(new CheckoutItem(new CheckoutItemID(randomUUID()), _checkout.getUuid(), new ProductID(randomUUID()), new ProductHeader("Product 2"), new Money(50), new ProductQuantity(3), new Date, new Date))

        await checkoutRepository.saveChanges(_checkout)

        let checkout_ = await checkoutRepository.findOneByUuid(uuid)

        expect( checkout_.getCheckoutItems().size).toBe(2)
        expect(checkout_.getSubTotal().getAmount()).toBe(390)
    })
    it('should retrieve Checkout Aggregate with an Item when deleted an item from aggregate', async () => {
        const uuid = randomUUID()
        const itemUuid = randomUUID()
        const _checkout = new Checkout(new CheckoutID(uuid), new CustomerID(randomUUID()), new Money(100), new CheckoutState(CheckoutStates.CHECKOUT_CREATED), new Date, new Date)
        _checkout.addAnItem(new CheckoutItem(new CheckoutItemID(itemUuid), _checkout.getUuid(), new ProductID(randomUUID()), new ProductHeader("Product 1"), new Money(120), new ProductQuantity(1), new Date, new Date))
        _checkout.addAnItem(new CheckoutItem(new CheckoutItemID(randomUUID()), _checkout.getUuid(), new ProductID(randomUUID()), new ProductHeader("Product 2"), new Money(50), new ProductQuantity(3), new Date, new Date))

        await checkoutRepository.saveChanges(_checkout)

        let checkout: Checkout = <Checkout> await checkoutRepository.findOneByUuid(uuid)
        expect( checkout.getCheckoutItems().size).toBe(2)
        checkout.takeOutAnItem(new CheckoutItemID(itemUuid))
        
        await checkoutRepository.updateCheckoutItemDocument(checkout)
        
        checkout = await checkoutRepository.findOneByUuid(uuid) as Checkout
        expect( checkout.getCheckoutItems().size).toBe(1)
        expect(checkout.getSubTotal().getAmount()).toBe(150)

    })

    it('should retrieve CheckoutItem from Checkout Aggregate when called findOneByUuid', async () => {
        const uuid = randomUUID()
        const itemUuid = randomUUID()
        const _checkout = new Checkout(new CheckoutID(uuid), new CustomerID(randomUUID()), new Money(100), new CheckoutState(CheckoutStates.CHECKOUT_CREATED), new Date, new Date)
        _checkout.addAnItem(new CheckoutItem(new CheckoutItemID(itemUuid), _checkout.getUuid(), new ProductID(randomUUID()), new ProductHeader("Product 1"), new Money(120), new ProductQuantity(1), new Date, new Date))
        _checkout.addAnItem(new CheckoutItem(new CheckoutItemID(randomUUID()), _checkout.getUuid(), new ProductID(randomUUID()), new ProductHeader("Product 2"), new Money(50), new ProductQuantity(3), new Date, new Date))

        await checkoutRepository.saveChanges(_checkout)

        let checkout_= await checkoutRepository.findOneByUuid(uuid)
        let item = checkout_.getCheckoutItems().get(itemUuid)
        expect(item.isNotNull()).toBeTruthy()

        expect(item.getProductHeader().getHeader()).toBe("Product 1")
    })

    it('should return correct sub total when shipping price added and actual sub total under 100', async () => {
        const uuid = randomUUID()
        const itemUuid = randomUUID()
        const _checkout = new Checkout(new CheckoutID(uuid), new CustomerID(randomUUID()), new Money(0), new CheckoutState(CheckoutStates.CHECKOUT_COMPLETED), new Date, new Date)
        _checkout.addAnItem(new CheckoutItem(new CheckoutItemID(itemUuid), _checkout.getUuid(), new ProductID(randomUUID()), new ProductHeader("Product 1"), new Money(50), new ProductQuantity(1), new Date, new Date))
        _checkout.setShippingPrice(() => new Money(20))
        await checkoutRepository.saveChanges(_checkout)
        
        let checkout_= await checkoutRepository.findOneByUuid(uuid)
        expect(checkout_.getSubTotal().getAmount()).toBe(70)
    })
    it('should return correct sub total when shipping price added and sub total amount more than 100', async () => {
        const uuid = randomUUID()
        const itemUuid = randomUUID()
        const _checkout = new Checkout(new CheckoutID(uuid), new CustomerID(randomUUID()), new Money(0), new CheckoutState(CheckoutStates.CHECKOUT_COMPLETED), new Date, new Date)
        _checkout.addAnItem(new CheckoutItem(new CheckoutItemID(itemUuid), _checkout.getUuid(), new ProductID(randomUUID()), new ProductHeader("Product 1"), new Money(101), new ProductQuantity(1), new Date, new Date))
        _checkout.setShippingPrice(() => new Money(20))
        await checkoutRepository.saveChanges(_checkout)
        
        let checkout_= await checkoutRepository.findOneByUuid(uuid)
        expect(checkout_.getSubTotal().getAmount()).toBe(101)
    }) 

})