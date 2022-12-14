import CheckoutItemID from '../../Core/Models/ValueObjects/CheckoutItemID';
import CheckoutItem from '../../Core/Models/Domain Models/Checkout/CheckoutItem';
import { randomUUID } from 'crypto';
import ProductID from '../../Core/Models/ValueObjects/ProductID';
import ProductHeader from '../../Core/Models/ValueObjects/ProductHeader';
import Money from '../../Core/Models/ValueObjects/Money';
import ProductQuantity from '../../Core/Models/ValueObjects/ProductQuantity';
import CheckoutItemBuilder from '../../Core/Models/Builders/CheckoutItemBuilder';
import CheckoutItemInterface from '../../Core/Models/Domain Models/Checkout/CheckoutItemInterface';
import ItMustBeConcreateCheckoutItemState from '../../Core/Models/Builders/States/CheckoutItemStates/ItMustBeConcreateCheckoutItemState';
import NullCheckoutItem from '../../Core/Models/Domain Models/Checkout/NullCheckoutItem';
import CreateInstanceOfCheckoutItemState from '../../Core/Models/Builders/States/CheckoutItemStates/CreateInstanceOfCheckoutItemState';
import CheckoutID from '../../Core/Models/ValueObjects/CheckoutID';
import NegativeNumberException from '../../Core/Exceptions/NegativeNumberException';

describe('CheckoutItem', () => {
    var checkoutItem: CheckoutItemInterface = null
    beforeEach(() => {
        checkoutItem = CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState)
                                                    .checkoutUuid(() => new CheckoutID(randomUUID()))
                                                    .checkoutItemUuid(() => new CheckoutItemID(randomUUID()))
                                                    .checkoutProductUuid(() => new ProductID(randomUUID()))
                                                    .checkoutProductHeader(() => new ProductHeader('Rolex Datejust 36mm Blue Dial Ref:126200'))
                                                    .checkoutProductBasePrice(() => new Money(169554))
                                                    .checkoutProductQuantity(() => new ProductQuantity(1))
                                                    .checkoutCreatedAt(new Date)
                                                    .checkoutUpdatedAt(new Date)
                                                    .build()
    })

    afterEach(() => checkoutItem = null)
    
    
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

        it('should return true when given valid property with CheckoutItemBuilder', () =>{
            const checkoutItem:CheckoutItemInterface = CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState)
                                                    .checkoutUuid(() => new CheckoutID(randomUUID()))
                                                    .checkoutItemUuid(() => new CheckoutItemID(randomUUID()))
                                                    .checkoutProductUuid(() => new ProductID(randomUUID()))
                                                    .checkoutProductHeader(() => new ProductHeader('Rolex Datejust 36mm Blue Dial Ref:126200'))
                                                    .checkoutProductBasePrice(() => new Money(169554))
                                                    .checkoutProductQuantity(() => new ProductQuantity(1))
                                                    .checkoutCreatedAt(new Date)
                                                    .checkoutUpdatedAt(new Date)
                                                    .build()
            expect(checkoutItem).toBeTruthy()
            expect(checkoutItem.getProductQuantity().getQuantity()).toBe(1)
        })
        
         it('should return NullCheckoutItem when given invalid property in CheckoutItemBuilder', () => {
            const checkoutItem:CheckoutItemInterface = CheckoutItemBuilder.initBuilder(new CreateInstanceOfCheckoutItemState)
                                                        .checkoutUuid(() => new CheckoutID(randomUUID()))
                                                        .checkoutItemUuid(() => new CheckoutItemID(randomUUID()))
                                                        .checkoutProductUuid(() => new ProductID(randomUUID()))
                                                        .checkoutProductHeader(() => new ProductHeader('Rolex Datejust 36mm Blue Dial Ref:126200'))
                                                        .checkoutProductBasePrice(() => new Money(-169554))
                                                        .checkoutProductQuantity(() => new ProductQuantity(-1))
                                                        .checkoutCreatedAt(new Date)
                                                        .checkoutUpdatedAt(new Date)
                                                        .build()
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