import DomainModelFactoryContext, { IDomainModelFactoryContext } from './../../Core/Models/Factories/DomainModelFactoryContext';
import CheckoutItemID from '../../Core/Models/ValueObjects/CheckoutItemID';
import CheckoutItem from '../../Core/Models/Domain Models/Checkout/CheckoutItem';
import { randomUUID } from 'crypto';
import ProductID from '../../Core/Models/ValueObjects/ProductID';
import ProductHeader from '../../Core/Models/ValueObjects/ProductHeader';
import Money from '../../Core/Models/ValueObjects/Money';
import ProductQuantity from '../../Core/Models/ValueObjects/ProductQuantity';
import CheckoutItemInterface from '../../Core/Models/Domain Models/Checkout/CheckoutItemInterface';
import NullCheckoutItem from '../../Core/Models/Domain Models/Checkout/NullCheckoutItem';
import CheckoutID from '../../Core/Models/ValueObjects/CheckoutID';
import NegativeNumberException from '../../Core/Exceptions/NegativeNumberException';
import ConcreateCheckoutItemFactory from '../../Core/Models/Factories/CheckoutItem/ConcreateCheckoutItem';
import NullableCheckoutItemFactory from '../../Core/Models/Factories/CheckoutItem/NullableCheckoutItemFactory';
import CheckoutItemConstructorParameters from '../../Core/Models/Factories/CheckoutItem/CheckoutItemConstructorParameters';

describe('CheckoutItem', () => {
    var checkoutItem: CheckoutItemInterface = null
    let factoryCtx: IDomainModelFactoryContext

    beforeEach(() => {
        factoryCtx = new DomainModelFactoryContext
        factoryCtx.addFactoryClass(ConcreateCheckoutItemFactory.name, new ConcreateCheckoutItemFactory)
                .addFactoryClass(NullableCheckoutItemFactory.name, new NullableCheckoutItemFactory)
        
        checkoutItem = factoryCtx.setFactoryMethod(ConcreateCheckoutItemFactory.name)
                                .createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({
                                    checkoutItemUuid: randomUUID(),
                                    checkoutUuid: randomUUID(),
                                    createdAt: new Date,
                                    productBasePrice:169554,
                                    productHeader:"Rolex Datejust 36mm Blue Dial Ref:126200",
                                    productQuantity:1,
                                    productUuid:randomUUID(),
                                    updatedAt:new Date
                                })
    })

    afterEach(() => {
        checkoutItem = null
        factoryCtx = null
    })
    
    
    describe('CheckoutItem Constructor', () => {
        it('should return true when given valid properties', () => {
            const checkoutItem: CheckoutItemInterface = new CheckoutItem(
                new CheckoutItemID(randomUUID()),
                new CheckoutID(randomUUID()),
                new ProductID(randomUUID()),
                new ProductHeader('Rolex Datejust 36mm Blue Dial Ref:126200'),
                new Money(169554),
                new ProductQuantity(1),
                new Date,
                new Date
            )
            expect(checkoutItem).toBeTruthy()
        })

        it('should return true when given valid property with Factory', () =>{
            const checkoutItem:CheckoutItemInterface = factoryCtx.setFactoryMethod(ConcreateCheckoutItemFactory.name)
                                                                .createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({
                                                                    checkoutItemUuid: randomUUID(),
                                                                    checkoutUuid: randomUUID(),
                                                                    createdAt: new Date,
                                                                    productBasePrice:169554,
                                                                    productHeader:"Rolex Datejust 36mm Blue Dial Ref:126200",
                                                                    productQuantity:1,
                                                                    productUuid:randomUUID(),
                                                                    updatedAt:new Date
                                                                })
            expect(checkoutItem).toBeTruthy()
            expect(checkoutItem.getProductQuantity().getQuantity()).toBe(1)
        })
        
         it('should return NullCheckoutItem when given invalid property in Factory', () => {
            const checkoutItem:CheckoutItemInterface = factoryCtx.setFactoryMethod(NullableCheckoutItemFactory.name)
                                                                .createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({
                                                                    checkoutItemUuid: randomUUID(),
                                                                    checkoutUuid: randomUUID(),
                                                                    createdAt: new Date,
                                                                    productBasePrice:169554,
                                                                    productHeader:"Rolex Datejust 36mm Blue Dial Ref",
                                                                    productQuantity:1,
                                                                    productUuid:null,
                                                                    updatedAt:new Date
                                                                })
            expect(checkoutItem).toBeInstanceOf(NullCheckoutItem)
            expect(checkoutItem.isNull()).toBe(true)})
        
        })

        describe('CheckoutItem Methods', () => {
            describe('CheckoutItem::changeProductBasePrice', () => {
                it('should be 200.000 amount when given 200.000 to parameter', () => {
                    const newProductBasePrice = 200000
                    checkoutItem.changeProductBasePrice(newProductBasePrice)
                    expect(checkoutItem.getProductBasePrice().getAmount()).toBe(newProductBasePrice)
                })

                it('should throw NegativeNumberException when given negative amount to parameter', () => {
                    const newProductBasePrice = -150000
                    expect(() => checkoutItem.changeProductBasePrice(newProductBasePrice)).toThrow(NegativeNumberException)
                })
            })

            describe('CheckoutItem::incraseQuantity', () => {
                it('(product quantity) should be 10 when given 9 to parameter', () => {
                    const newIncrementAmountOfItem = 9
                    checkoutItem.incraseQuantity(newIncrementAmountOfItem)
                    expect(checkoutItem.getProductQuantity().getQuantity()).toBe(10)
                })
                it('(product quantity) should be 10 when given -9 to parameter', () => {
                    const newIncrementAmountOfItem = -9
                    checkoutItem.incraseQuantity(newIncrementAmountOfItem)
                    expect(checkoutItem.getProductQuantity().getQuantity()).toBe(10)
                })
            })

            describe('CheckoutItem::decreaseQuantity', () => {
                it('(product quantity) should be 0 when given 1 to parameter', () => {
                    const decrementAmountOfItem = 1
                    checkoutItem.decreaseQuantity(decrementAmountOfItem)
                    expect(checkoutItem.getProductQuantity().getQuantity()).toBe(0)
                })
                it('(product quantity) should be 0 when given -1 to parameter', () => {
                    const decrementAmountOfItem = -1
                    checkoutItem.decreaseQuantity(decrementAmountOfItem)
                    expect(checkoutItem.getProductQuantity().getQuantity()).toBe(0)
                })

                it('(product quantity) should return zero when given making negative number (2) to ProductQuantity instance', () => {
                    const decrementAmountOfItem = 2
                    checkoutItem.decreaseQuantity(decrementAmountOfItem)
                    expect(checkoutItem.getProductQuantity().getQuantity()).toBe(0)

                })
            })
        })
})