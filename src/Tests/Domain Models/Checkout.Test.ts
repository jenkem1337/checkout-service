import CheckoutID from '../../Core/Models/ValueObjects/CheckoutID';
import Checkout from '../../Core/Models/Domain Models/Checkout/Checkout';
import { randomUUID } from 'crypto';
import CustomerID from '../../Core/Models/ValueObjects/CustomerID';
import Address from '../../Core/Models/ValueObjects/Address';
import Money from '../../Core/Models/ValueObjects/Money';
import PeymentMethod, { PeymentMethodEnum } from '../../Core/Models/ValueObjects/PeymentMethod';
import CheckoutState from '../../Core/Models/ValueObjects/CheckoutState';
import { CheckoutStates } from '../../Core/Models/ValueObjects/CheckoutState';
import CheckoutItemInterface from '../../Core/Models/Domain Models/Checkout/CheckoutItemInterface';
import CheckoutInterface from '../../Core/Models/Domain Models/Checkout/CheckoutInterface';
import CheckoutBuilder from '../../Core/Models/Builders/CheckoutBuilder';
import CreateInstanceOfCheckoutBuilderState from '../../Core/Models/Builders/States/CheckoutAggregateStates/CreateCheckoutBuilderState';
import NullCheckout from '../../Core/Models/Domain Models/Checkout/NullCheckout';
import NullPropertyException from '../../Core/Exceptions/NullPropertyException';
import FromCreationalCommandCheckoutBuilderState from '../../Core/Models/Builders/States/CheckoutAggregateStates/FromCommandCheckoutBuilderState';
import NullIdException from '../../Core/Exceptions/NullIdException';
import ItMustBeConcreteCheckoutBuilderState from '../../Core/Models/Builders/States/CheckoutAggregateStates/ItMustBeConcreteCheckoutBuilderState';
import CheckoutItemBuilder from '../../Core/Models/Builders/CheckoutItemBuilder';
import ItMustBeConcreateCheckoutItemState from '../../Core/Models/Builders/States/CheckoutItemStates/ItMustBeConcreateCheckoutItemState';
import CheckoutItemID from '../../Core/Models/ValueObjects/CheckoutItemID';
import ProductID from '../../Core/Models/ValueObjects/ProductID';
import ProductHeader from '../../Core/Models/ValueObjects/ProductHeader';
import ProductQuantity from '../../Core/Models/ValueObjects/ProductQuantity';
import CheckoutItemNotFoundException from '../../Core/Exceptions/CheckoutItemNotFoundException';
import NegativeNumberException from '../../Core/Exceptions/NegativeNumberException';
describe('Checkout', () => {
    let checkoutDomainModel: Checkout = null
    beforeEach(() => {
        checkoutDomainModel = <Checkout> CheckoutBuilder.initBuilder(new FromCreationalCommandCheckoutBuilderState)
        .checkoutUuid(() => new CheckoutID(randomUUID()))
        .userUuid(() => new CustomerID(randomUUID()))
        .subTotal(() => new Money(0))
        .checkoutState(() => new CheckoutState(CheckoutStates.CHECKOUT_CREATED))
        .createdAt(new Date)
        .updatedAt(new Date)
        .build()
    })
    afterEach(()=> {
        checkoutDomainModel = null
    })
    describe('Checkout Constructor', () => {
        it('should return true when given all property valid', () => {
            let checkout: CheckoutInterface = new Checkout(
                new CheckoutID(randomUUID()),
                new CustomerID(randomUUID()),
                new Money(0),
                new CheckoutState(CheckoutStates.CHECKOUT_CREATED),
                new Date,
                new Date,
                new Map<string, CheckoutItemInterface>,
                new Address('Home','John','Doe','Deneme deneme deneme', 'Turkey','Istanbul','Kadikoy', '34734'),
                new PeymentMethod('CREDIT_CART'),
                new Money(18),

                )
            expect(checkout).toBeTruthy()
            expect(checkout.getAddress().getAddressCountry()).toBe('Turkey')
            expect(checkout.getCheckoutItems()).toBeInstanceOf(Map<string, CheckoutItemInterface>)
            expect(checkout.getCheckoutState().getState()).toBe('CHECKOUT_CREATED')
            expect(checkout.getPeymentMethod().getPeymentMethod()).toBe('CREDIT_CART')
            expect(checkout.getShippingPrice().getAmount()).toBe(18)
            expect(checkout.getSubTotal().getAmount()).toBe(0)
        })
        it('should return true when given without optional parameters', () => {
            let checkout: CheckoutInterface = new Checkout(
                                                                new CheckoutID(randomUUID()),
                                                                new CustomerID(randomUUID()),
                                                                new Money(0),
                                                                new CheckoutState(CheckoutStates.CHECKOUT_CREATED),
                                                                new Date,
                                                                new Date)
                expect(checkout).toBeTruthy()
                expect(checkout.getCheckoutItems()).toBeInstanceOf(Map<string, CheckoutItemInterface>)
                expect(checkout.getCheckoutState().getState()).toBe('CHECKOUT_CREATED')
                expect(checkout.getSubTotal().getAmount()).toBe(0)
    
        })
        
    })
    
    describe('Checkout Builders', () => {
        describe('CheckoutBuilder::CreateInstanceOfCheckoutState', () => {
            it('should return concreate Chekout instance when initialize without optional parameters', () => {
                let checkout = CheckoutBuilder.initBuilder(new CreateInstanceOfCheckoutBuilderState)
                                                    .checkoutUuid(() => new CheckoutID(randomUUID()))
                                                    .userUuid(() => new CustomerID(randomUUID()))
                                                    .subTotal(() => new Money(0))
                                                    .shippingPrice(()=> new Money(18))
                                                    .checkoutState(() => new CheckoutState(CheckoutStates.CHECKOUT_CREATED))
                                                    .createdAt(new Date)
                                                    .updatedAt(new Date)
                                                    .build()
                expect(checkout).toBeInstanceOf(Checkout)
                expect(checkout).toBeTruthy()
            })
            
            it('should return concreate Checkout instance when initialize with address, peyment method and shipping price but without Map', () => {
                let checkout = CheckoutBuilder.initBuilder(new CreateInstanceOfCheckoutBuilderState)
                                                    .checkoutUuid(() => new CheckoutID(randomUUID()))
                                                    .userUuid(() => new CustomerID(randomUUID()))
                                                    .subTotal(() => new Money(0))
                                                    .shippingPrice(()=> new Money(18))
                                                    .peymentMethod(() => new PeymentMethod('CREDIT_CART'))
                                                    .checkoutState(() => new CheckoutState(CheckoutStates.CHECKOUT_CREATED))
                                                    .address(() => new Address('Home','John','Doe','Deneme deneme deneme', 'Turkey','Istanbul','Kadikoy', '34734')                                                    )
                                                    .createdAt(new Date)
                                                    .updatedAt(new Date)
                                                    .build()
                expect(checkout).toBeTruthy()
                expect(checkout).toBeInstanceOf(Checkout)
                expect(checkout.getCheckoutItems().size).toBe(0)
            })

            it('should return NullCheckout when given any ValueObject with null property', () => {
                let checkout: NullCheckout = CheckoutBuilder.initBuilder(new CreateInstanceOfCheckoutBuilderState)
                .checkoutUuid(() => new CheckoutID(randomUUID()))
                .userUuid(() => new CustomerID(randomUUID()))
                .subTotal(() => new Money(0))
                .shippingPrice(()=> new Money(18))
                .peymentMethod(() => new PeymentMethod(null))
                .checkoutState(() => new CheckoutState(CheckoutStates.CHECKOUT_CREATED))
                .address(() => new Address('Home','John','Doe','Deneme deneme deneme', 'Turkey','Istanbul','Kadikoy', '34734')                                                    )
                .createdAt(new Date)
                .updatedAt(new Date)
                .build()

                expect(checkout).toBeInstanceOf(NullCheckout)
                expect(checkout.isNotNull()).toBe(false)
            })
        })
        describe('CheckoutBuilder::ItMustBeConcreateCheckoutState', () => {
            it('should return concreate Checkout instance when given optional address and shipping price parameter', () => {
                let checkout = CheckoutBuilder.initBuilder(new ItMustBeConcreteCheckoutBuilderState)
                .checkoutUuid(() => new CheckoutID(randomUUID()))
                .userUuid(() => new CustomerID(randomUUID()))
                .subTotal(() => new Money(0))
                .shippingPrice(()=> new Money(18))
                .checkoutState(() => new CheckoutState(CheckoutStates.CHECKOUT_CREATED))
                .address(() => new Address('Home','John','Doe','Deneme deneme deneme', 'Turkey','Istanbul','Kadikoy', '34734')                                                    )
                .createdAt(new Date)
                .updatedAt(new Date)
                .build()
                
                expect(checkout).toBeTruthy()
                expect(checkout.getCheckoutItems().size).toBe(0)
            })
            it('should throw any about ValueObject exception when given null any ValueObject construtor', () => {
                expect( () => CheckoutBuilder.initBuilder(new ItMustBeConcreteCheckoutBuilderState)
                .checkoutUuid(() => new CheckoutID(randomUUID()))
                .userUuid(() => new CustomerID(randomUUID()))
                .subTotal(() => new Money(0))
                .shippingPrice(()=> new Money(18))
                .peymentMethod(() => new PeymentMethod(null))
                .checkoutState(() => new CheckoutState(CheckoutStates.CHECKOUT_CREATED))
                .address(() => new Address('Home','John','Doe','Deneme deneme deneme', 'Turkey','Istanbul','Kadikoy', '34734')                                                    )
                .createdAt(new Date)
                .updatedAt(new Date)
                .build()).toThrow(NullPropertyException)
            })
        })
        describe('CheckoutBuilder::FromCreationalCommandCheckoutBuilderState', () => {
            it('should return concreate Checkout instance when given valid parameters', () => {
                let checkout = CheckoutBuilder.initBuilder(new FromCreationalCommandCheckoutBuilderState)
                .checkoutUuid(() => new CheckoutID(randomUUID()))
                .userUuid(() => new CustomerID(randomUUID()))
                .subTotal(() => new Money(0))
                .shippingPrice(()=> new Money(18))
                .checkoutState(() => new CheckoutState(CheckoutStates.CHECKOUT_CREATED))
                .createdAt(new Date)
                .updatedAt(new Date)
                .build()
                
                expect(checkout).toBeInstanceOf(Checkout)
                expect(checkout).toBeTruthy()
            })
            it('should throw exception when any ValueObject constructor parameter given with null property', () => {
                expect(() => CheckoutBuilder.initBuilder(new FromCreationalCommandCheckoutBuilderState)
                .checkoutUuid(() => new CheckoutID(randomUUID()))
                .userUuid(() => new CustomerID(null))
                .subTotal(() => new Money(0))
                .shippingPrice(()=> new Money(18))
                .checkoutState(() => new CheckoutState(CheckoutStates.CHECKOUT_CREATED))
                .createdAt(new Date)
                .updatedAt(new Date)
                .build()).toThrow(NullIdException)
            })
        })

        describe('Checkout Methods', () => {
            describe('Checkout::addAnItem', () => {
                it('should return correct sub total and Map size when given an concreate item to parameter', () => {
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState)
                    .checkoutItemUuid(() => new CheckoutItemID(randomUUID()))
                    .checkoutUuid(() => checkoutDomainModel.getUuid())
                    .checkoutProductUuid(() => new ProductID(randomUUID()))
                    .checkoutProductHeader(() => new ProductHeader('Deneme'))
                    .checkoutProductBasePrice(() => new Money(123))
                    .checkoutProductQuantity(() => new ProductQuantity(1))
                    .checkoutCreatedAt(new Date)
                    .checkoutUpdatedAt(new Date)
                    .build())

                    expect(checkoutDomainModel.getSubTotal().getAmount()).toBe(123)
                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(1)
                })
                it('should return correct sub total, quantity and Map size when given same three concreate item to parameter', () => {
                    let checkoutItemUuid = randomUUID()
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    let checkoutItems = checkoutDomainModel.getCheckoutItems()
                    let item = checkoutItems.get(checkoutItemUuid)

                    expect(item.getProductQuantity().getQuantity()).toBe(3)
                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(1)

                    expect(checkoutDomainModel.getSubTotal().getAmount()).toBe(369)
                })
            })
            describe('Checkout::addItemOneMoreThan', () => {
                it('should return correct sub total, quantity and Map size when given same item uuid and quantity', () => {
                    let checkoutItemUuid = randomUUID()
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addItemOneMoreThan(new CheckoutItemID(checkoutItemUuid), new ProductQuantity(3))
                    
                    let checkoutItems = checkoutDomainModel.getCheckoutItems()
                    let item = checkoutItems.get(checkoutItemUuid)

                    expect(item.getProductQuantity().getQuantity()).toBe(4)
                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(1)
                    expect(checkoutDomainModel.getSubTotal().getAmount()).toBe(492)

                })                
                
                it('should throw CheckoutItemNotFoundException when given not exist item uuid', () => {
                    expect(() => checkoutDomainModel.addItemOneMoreThan(new CheckoutItemID(randomUUID()), new ProductQuantity(3)))
                        .toThrow(CheckoutItemNotFoundException)  
                })

                it('should return correct sub total, quantity and Map size when given same item uuid and just one quantity', () => {
                    let checkoutItemUuid = randomUUID()
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addItemOneMoreThan(new CheckoutItemID(checkoutItemUuid), new ProductQuantity(1))
                    
                    let checkoutItems = checkoutDomainModel.getCheckoutItems()
                    let item = checkoutItems.get(checkoutItemUuid)

                    expect(item.getProductQuantity().getQuantity()).toBe(2)
                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(1)
                    expect(checkoutDomainModel.getSubTotal().getAmount()).toBe(246)
                })
            })

            describe('Checkout::takeOutAnItem', () => {
                it('should return correct sub total and Map size when given an item uuid', () => {
                    let checkoutItemUuid = randomUUID()
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())

                    checkoutDomainModel.takeOutAnItem(new CheckoutItemID(checkoutItemUuid))


                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(0)
                    expect(checkoutDomainModel.getSubTotal().getAmount()).toBe(0)

                })
                it('should return correct sub total, quantity and Map size when given same items uuid', () => {
                    let checkoutItemUuid = randomUUID()
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    
                    checkoutDomainModel.takeOutAnItem(new CheckoutItemID(checkoutItemUuid))

                    let checkoutItems = checkoutDomainModel.getCheckoutItems()
                    let item = checkoutItems.get(checkoutItemUuid)

                    expect(item.getProductQuantity().getQuantity()).toBe(2)
                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(1)
                    expect(checkoutDomainModel.getSubTotal().getAmount()).toBe(246)
                })
                
                it('should throw CheckoutItemNotFoundException when given not exist item uuid', () => {
                    expect(() => checkoutDomainModel.takeOutAnItem(new CheckoutItemID(randomUUID())))
                        .toThrow(CheckoutItemNotFoundException)  
                })
            })

            describe('Checkout::takeOutOneMoreThanItem', () => {
                it('should return correct sub total, quantity and Map size when given same items uuid and quantity', () => {
                    let checkoutItemUuid = randomUUID()
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    
                    checkoutDomainModel.takeOutOneMoreThanItem(new CheckoutItemID(checkoutItemUuid), new ProductQuantity(2))

                    let checkoutItems = checkoutDomainModel.getCheckoutItems()
                    let item = checkoutItems.get(checkoutItemUuid)

                    expect(item.getProductQuantity().getQuantity()).toBe(1)
                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(1)
                    expect(checkoutDomainModel.getSubTotal().getAmount()).toBe(123)
                })

                it('should return correct sub total and Map size when given same items uuid and more than actual quantity', () => {
                    let checkoutItemUuid = randomUUID()
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    
                    checkoutDomainModel.takeOutOneMoreThanItem(new CheckoutItemID(checkoutItemUuid), new ProductQuantity(10))

                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(0)
                    expect(checkoutDomainModel.getSubTotal().getAmount()).toBe(0)

                })
                it('should throw CheckoutItemNotFoundException when given not exist item uuid', () => {
                    expect(() => checkoutDomainModel.takeOutOneMoreThanItem(new CheckoutItemID(randomUUID()), new ProductQuantity(3)))
                        .toThrow(CheckoutItemNotFoundException)  
                })
            })

            describe('Checkout::takeOutSameItems', () => {
                it('should return correct sub total and Map size when given same items uuid', () => {
                    let checkoutItemUuid = randomUUID()
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    
                    checkoutDomainModel.takeOutSameItems(new CheckoutItemID(checkoutItemUuid))

                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(0)
                    expect(checkoutDomainModel.getSubTotal().getAmount()).toBe(0)
                })

                it('should throw CheckoutItemNotFoundException when given not exist item uuid', () => {
                    expect(() => checkoutDomainModel.takeOutSameItems(new CheckoutItemID(randomUUID())))
                        .toThrow(CheckoutItemNotFoundException)  
                })

            })

            describe('Checkout::updateItemPrices', () => {
                it('should should return correct sub total and Map size when given product uuid and new price', () => {
                    let checkoutItemUuid = randomUUID()
                    let productUuid = randomUUID()
                    
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(productUuid)).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(productUuid)).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(productUuid)).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())

                    checkoutDomainModel.updateItemPrices(new ProductID(productUuid), new Money(100))
                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(1)
                    expect(checkoutDomainModel.getSubTotal().getAmount()).toBe(300)
                })

                it('should throw NegativeNumberException when given new price to negative value', () => {
                    let checkoutItemUuid = randomUUID()
                    let productUuid = randomUUID()
                    
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(productUuid)).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(productUuid)).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(productUuid)).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(123)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())

                   expect(() => checkoutDomainModel.updateItemPrices(new ProductID(productUuid), new Money(-100)))
                        .toThrow(NegativeNumberException)

                })
            })

            describe('Checkout::cancelThisCheckout', () => {
                it('should be CHECKOUT_CANCELLED when calling method', () => {
                    let expected = 'CHECKOUT_CANCELLED'
                    checkoutDomainModel.cancelThisCheckout()
                    expect(checkoutDomainModel.getCheckoutState().getState()).toBe(expected)
                })
            })

            describe('Checkout::completeThisCheckout', () => {
                it('should be CHECKOUT_COMPLETED when calling method', () => {
                    let expected = 'CHECKOUT_COMPLETED'
                    checkoutDomainModel.completeThisCheckout()
                    expect(checkoutDomainModel.getCheckoutState().getState()).toBe(expected)
                })
            })

            describe('Checkout::setShippingAddress', () => {
                it('should return valid values about address when given address value object instance', () => {
                    checkoutDomainModel.setShippingAddress(
                        () => new Address('Home', 'John','Doe','Example Example Example', 'Turkey', 'Istanbul', 'Bakirkoy', '34147')
                    )
                    let shippingAddress = checkoutDomainModel.getAddress()
                    expect(shippingAddress.getAddressName()).toBe('Home')
                    expect(shippingAddress.getAddressOwnerName()).toBe('John')
                    expect(shippingAddress.getAddressOwnerSurname()).toBe('Doe')
                    expect(shippingAddress.getFullAddressInformation()).toBe('Example Example Example')
                    expect(shippingAddress.getAddressCountry()).toBe('Turkey')
                    expect(shippingAddress.getAddressProvince()).toBe('Istanbul')
                    expect(shippingAddress.getAddressDistrict()).toBe('Bakirkoy')
                    expect(shippingAddress.getAddressZipCode()).toBe('34147')
                })
            })
            describe('Checkout::setPeymentMethod', () => {
                it('should return valid values about peyment method when given peyment method value object instance', () => {
                    checkoutDomainModel.setPeymentMethod(() => new PeymentMethod(PeymentMethodEnum.CREDIT_CART))
                    let peymentMethod = checkoutDomainModel.getPeymentMethod()
                    expect(peymentMethod.getPeymentMethod()).toBe('CREDIT_CART')
                })
            })

            describe('Checkout::setShippingPrice', () => {
                it('should return valid values about shipping price when given money value object instance', () => {
                    checkoutDomainModel.setShippingPrice(() => new Money(8))
                    let shippingPrice = checkoutDomainModel.getShippingPrice()
                    expect(shippingPrice.getAmount()).toBe(8)
                })

                it('should return sub total + shipping price if sub total less than 100', () => {

                    let checkoutItemUuid = randomUUID()
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(20)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(20)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    //before
                    expect(checkoutDomainModel.getSubTotal().getAmount()).toBe(40)
                    
                    checkoutDomainModel.setShippingPrice(() => new Money(8))
                    //after
                    expect(checkoutDomainModel.getSubTotal().getAmount()).toBe(48)

                })

                it('should return sub total without shipping price if sub total equal 100', () =>  {
                    let checkoutItemUuid = randomUUID()
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(50)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(50)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    //before
                    expect(checkoutDomainModel.getSubTotal().getAmount()).toBe(100)

                    checkoutDomainModel.setShippingPrice(() => new Money(8))
                    //after
                    expect(checkoutDomainModel.getSubTotal().getAmount()).toBe(100)
                    
                })

                it('should return sub total without shipping price if sub total more than 100', () => {
                    let checkoutItemUuid = randomUUID()
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(150)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    checkoutDomainModel.addAnItem(CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState).checkoutItemUuid(() => new CheckoutItemID(checkoutItemUuid)).checkoutUuid(() => checkoutDomainModel.getUuid()).checkoutProductUuid(() => new ProductID(randomUUID())).checkoutProductHeader(() => new ProductHeader('Deneme')).checkoutProductBasePrice(() => new Money(150)).checkoutProductQuantity(() => new ProductQuantity(1)).checkoutCreatedAt(new Date).checkoutUpdatedAt(new Date).build())
                    //before
                    expect(checkoutDomainModel.getSubTotal().getAmount()).toBe(300)

                    checkoutDomainModel.setShippingPrice(() => new Money(8))
                    //after
                    expect(checkoutDomainModel.getSubTotal().getAmount()).toBe(300)

                })
            })
        })
    })
})