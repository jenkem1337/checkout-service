import { Test } from '@nestjs/testing';
import Checkout from '../../../Core/Models/Domain Models/Checkout/Checkout';
import CheckoutRepository from '../../../Core/Interfaces/CheckoutRepository';
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
import CheckoutAggregateMapperContext from '../../../Infrastructure/Repository/Mapper/CheckoutAggregateMapperContext';
import WriteCheckoutAggregateMapper from '../../../Infrastructure/Repository/Mapper/WriteCheckoutAggregateMapper';
import CheckoutRepositoryImpl from '../../../Infrastructure/Repository/CheckoutRepositoryImpl';
import { DataSource } from 'typeorm';
import CheckoutDataMapper from '../../../Infrastructure/Entity/CheckoutDataMapper';
import CheckoutItemDataMapper from '../../../Infrastructure/Entity/CheckoutItemDataMapper';
import DomainModelFactoryContext, { IDomainModelFactoryContext } from '../../../Core/Models/Factories/DomainModelFactoryContext';
import NullableAllArgumentCheckoutFactory from '../../../Core/Models/Factories/Checkout/NullableAllArgumentCheckoutFactory';
import NullableCheckoutItemFactory from '../../../Core/Models/Factories/CheckoutItem/NullableCheckoutItemFactory';




describe('Checkout Repository', () => {
    let checkoutRepository: CheckoutRepository = null
    
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CheckoutRepositoryImpl,
                {
                    provide: CheckoutAggregateMapperContext.name,
                    useFactory: (domainModelFactoryCtx: IDomainModelFactoryContext) => {
                        const context = new CheckoutAggregateMapperContext
                        context.setStrategy(new WriteCheckoutAggregateMapper(domainModelFactoryCtx))
                        return context;
                    },
                    inject: [{token: "DomainModelFactoryContext", optional:false}]
                
                },
                {
                    provide:"DomainModelFactoryContext",
                    useFactory: () => {
                        const factoryCtx: IDomainModelFactoryContext = new DomainModelFactoryContext()
                        factoryCtx.addFactoryClass(NullableAllArgumentCheckoutFactory.name, new NullableAllArgumentCheckoutFactory)
                                .addFactoryClass(NullableCheckoutItemFactory.name, new NullableCheckoutItemFactory)
                        return factoryCtx
                    }
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

        ]
        }).compile()

        checkoutRepository = await moduleRef.resolve<CheckoutRepositoryImpl>(CheckoutRepositoryImpl)
    })

    afterEach(() => {
        checkoutRepository = null
    })

    it('should be save an instance of Checkout when called saveChanges', () => {
        expect(
            () => checkoutRepository.saveChanges(new Checkout(new CheckoutID(randomUUID()), new CustomerID(randomUUID()), new CheckoutState(CheckoutStates.CHECKOUT_CREATED), new Date, new Date))
        ).toBeTruthy()
    })
    it('should retrieve NullCheckout when given absent uuid', async () => {
        await checkoutRepository.saveChanges(new Checkout(new CheckoutID(randomUUID()), new CustomerID(randomUUID()), new CheckoutState(CheckoutStates.CHECKOUT_CREATED), new Date, new Date))
        let checkoutAggregate: NullCheckout = await  checkoutRepository.findOneByUuid(randomUUID())
        expect(checkoutAggregate.isNull()).toBe(true)

    })
    it('should retrieve Checkout Aggregate when called findOneByUuid', async () => {
        const uuid = randomUUID()
        await checkoutRepository.saveChanges(new Checkout(new CheckoutID(uuid), new CustomerID(randomUUID()), new CheckoutState(CheckoutStates.CHECKOUT_CREATED), new Date, new Date))
        let checkoutAggregate = await  checkoutRepository.findOneByUuid(uuid)
        expect(checkoutAggregate.isNull()).toBe(false)
    })
    it('should should retrieve Checkout Aggregate when called findOneByUuidAndCustomerUuid', async () => {
        const uuid = randomUUID()
        const customerUuid = randomUUID()
        await checkoutRepository.saveChanges(new Checkout(new CheckoutID(uuid), new CustomerID(customerUuid),  new CheckoutState(CheckoutStates.CHECKOUT_CREATED), new Date, new Date))
        let checkoutAggregate = await  checkoutRepository.findOneByUuidAndCustomerUuid(uuid, customerUuid)
        expect(checkoutAggregate.isNull()).toBe(false)
    })
    it('should retrieve Checkout Aggregate with Items when called findOneByUuid', async () => {
        const uuid = randomUUID()
        const _checkout = new Checkout(new CheckoutID(uuid), new CustomerID(randomUUID()),  new CheckoutState(CheckoutStates.CHECKOUT_CREATED), new Date, new Date)
        _checkout.addAnItem(new CheckoutItem(new CheckoutItemID(randomUUID()), _checkout.getUuid(), new ProductID(randomUUID()), new ProductHeader("Product 1"), new Money(120), new ProductQuantity(2), new Date, new Date))
        _checkout.addAnItem(new CheckoutItem(new CheckoutItemID(randomUUID()), _checkout.getUuid(), new ProductID(randomUUID()), new ProductHeader("Product 2"), new Money(50), new ProductQuantity(3), new Date, new Date))

        await checkoutRepository.saveChanges(_checkout)

        let checkout_ = await checkoutRepository.findOneByUuid(uuid)

        expect( checkout_.getCheckoutItems().size).toBe(2)
        
    })
    it('should retrieve Checkout Aggregate with an Item when deleted an item from aggregate', async () => {
        const uuid = randomUUID()
        const itemUuid = randomUUID()
        const _checkout = new Checkout(new CheckoutID(uuid), new CustomerID(randomUUID()), new CheckoutState(CheckoutStates.CHECKOUT_CREATED), new Date, new Date)
        _checkout.addAnItem(new CheckoutItem(new CheckoutItemID(itemUuid), _checkout.getUuid(), new ProductID(randomUUID()), new ProductHeader("Product 1"), new Money(120), new ProductQuantity(1), new Date, new Date))
        _checkout.addAnItem(new CheckoutItem(new CheckoutItemID(randomUUID()), _checkout.getUuid(), new ProductID(randomUUID()), new ProductHeader("Product 2"), new Money(50), new ProductQuantity(3), new Date, new Date))

        await checkoutRepository.saveChanges(_checkout)

        let checkout_: Checkout = <Checkout> await checkoutRepository.findOneByUuid(uuid)
        expect( checkout_.getCheckoutItems().size).toBe(2)

        checkout_.takeOutAnItem(new CheckoutItemID(itemUuid))
        
        await checkoutRepository.saveChanges(checkout_)
        
        let _checkout_ = await checkoutRepository.findOneByUuid(uuid)
        expect( _checkout_.getCheckoutItems().size).toBe(1)

    })

    it('should retrieve CheckoutItem from Checkout Aggregate when called findOneByUuid', async () => {
        const uuid = randomUUID()
        const itemUuid = randomUUID()
        const _checkout = new Checkout(new CheckoutID(uuid), new CustomerID(randomUUID()), new CheckoutState(CheckoutStates.CHECKOUT_CREATED), new Date, new Date)
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
        const _checkout = new Checkout(new CheckoutID(uuid), new CustomerID(randomUUID()), new CheckoutState(CheckoutStates.CHECKOUT_COMPLETED), new Date, new Date)
        _checkout.addAnItem(new CheckoutItem(new CheckoutItemID(itemUuid), _checkout.getUuid(), new ProductID(randomUUID()), new ProductHeader("Product 1"), new Money(50), new ProductQuantity(1), new Date, new Date))
        _checkout.setShippingPrice(() => new Money(20))
        await checkoutRepository.saveChanges(_checkout)
        
        let checkout_= await checkoutRepository.findOneByUuid(uuid)
        
    })
    it('should return correct sub total when shipping price added and sub total amount more than 100', async () => {
        const uuid = randomUUID()
        const itemUuid = randomUUID()
        const _checkout = new Checkout(new CheckoutID(uuid), new CustomerID(randomUUID()), new CheckoutState(CheckoutStates.CHECKOUT_COMPLETED), new Date, new Date)
        _checkout.addAnItem(new CheckoutItem(new CheckoutItemID(itemUuid), _checkout.getUuid(), new ProductID(randomUUID()), new ProductHeader("Product 1"), new Money(101), new ProductQuantity(1), new Date, new Date))
        _checkout.setShippingPrice(() => new Money(20))
        await checkoutRepository.saveChanges(_checkout)
        
        let checkout_= await checkoutRepository.findOneByUuid(uuid)
        
    })
    it('should return Checkout Aggregate Array when called findManyByUuidA', async () => {
        const customerUuid = randomUUID()
        await checkoutRepository.saveChanges( new Checkout(new CheckoutID(randomUUID()), new CustomerID(customerUuid),  new CheckoutState(CheckoutStates.CHECKOUT_COMPLETED), new Date, new Date) )
        await checkoutRepository.saveChanges( new Checkout(new CheckoutID(randomUUID()), new CustomerID(customerUuid),  new CheckoutState(CheckoutStates.CHECKOUT_COMPLETED), new Date, new Date) )
        await checkoutRepository.saveChanges( new Checkout(new CheckoutID(randomUUID()), new CustomerID(customerUuid),  new CheckoutState(CheckoutStates.CHECKOUT_COMPLETED), new Date, new Date) )

        const checkoutDomainModelArr = await checkoutRepository.findManyByCustomerUuid(customerUuid)

        expect(checkoutDomainModelArr.length).toBe(3)
    })
    it('should return NullCheckout when absent customer uuid', async () => {
        await checkoutRepository.saveChanges( new Checkout(new CheckoutID(randomUUID()), new CustomerID(randomUUID()), new CheckoutState(CheckoutStates.CHECKOUT_COMPLETED), new Date, new Date) )
        await checkoutRepository.saveChanges( new Checkout(new CheckoutID(randomUUID()), new CustomerID(randomUUID()), new CheckoutState(CheckoutStates.CHECKOUT_COMPLETED), new Date, new Date) )
        await checkoutRepository.saveChanges( new Checkout(new CheckoutID(randomUUID()), new CustomerID(randomUUID()), new CheckoutState(CheckoutStates.CHECKOUT_COMPLETED), new Date, new Date) )
        
        const checkoutDomainModelArr =  await checkoutRepository.findManyByCustomerUuid(randomUUID())
        for(let checkout of checkoutDomainModelArr){
            expect(checkout).toBeInstanceOf(NullCheckout)
        }
        
    })
})