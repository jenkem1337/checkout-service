import CheckoutID from '../../Core/Models/ValueObjects/CheckoutID';
import Checkout from '../../Core/Models/Domain Models/Checkout/Checkout';
import { randomUUID } from 'crypto';
import CustomerID from '../../Core/Models/ValueObjects/CustomerID';
import CheckoutState from '../../Core/Models/ValueObjects/CheckoutState';
import { CheckoutStates } from '../../Core/Models/ValueObjects/CheckoutState';
import CheckoutItemInterface from '../../Core/Models/Domain Models/Checkout/CheckoutItemInterface';
import CheckoutInterface from '../../Core/Models/Domain Models/Checkout/CheckoutInterface';
import NullPropertyException from '../../Core/Exceptions/NullPropertyException';
import CheckoutItemID from '../../Core/Models/ValueObjects/CheckoutItemID';
import ProductQuantity from '../../Core/Models/ValueObjects/ProductQuantity';
import CheckoutItemNotFoundException from '../../Core/Exceptions/CheckoutItemNotFoundException';
import ConcreteCheckoutFactory from '../../Core/Models/Factories/Checkout/ConcreteCheckoutFactory';
import CheckoutConstructorParamaters from '../../Core/Models/Factories/Checkout/CheckoutConstructorParameters';
import NullableCheckoutFactory from '../../Core/Models/Factories/Checkout/NullableCheckoutFactory';
import NullCheckout from '../../Core/Models/Domain Models/Checkout/NullCheckout';
import CheckoutItemConstructorParameters from '../../Core/Models/Factories/CheckoutItem/CheckoutItemConstructorParameters';
import ConcreateCheckoutItemFactory from '../../Core/Models/Factories/CheckoutItem/ConcreateCheckoutItem';
import NullableCheckoutItemFactory from '../../Core/Models/Factories/CheckoutItem/NullableCheckoutItemFactory';
import DomainModelFactoryContext, { IDomainModelFactoryContext } from '../../Core/Models/Factories/DomainModelFactoryContext';
describe('Checkout', () => {
    let checkoutDomainModel: CheckoutInterface = null
    let factoryCtx: IDomainModelFactoryContext
    beforeEach(() => {
        factoryCtx = new DomainModelFactoryContext()
        factoryCtx.addFactoryClass(NullableCheckoutFactory.name, new NullableCheckoutFactory())
                .addFactoryClass(ConcreteCheckoutFactory.name, new ConcreteCheckoutFactory)
                .addFactoryClass(ConcreateCheckoutItemFactory.name, new ConcreateCheckoutItemFactory)
                .addFactoryClass(NullableCheckoutItemFactory.name, new NullableCheckoutItemFactory)
        
        checkoutDomainModel = factoryCtx.setFactoryMethod(ConcreteCheckoutFactory.name)
                                        .createInstance({
                                                    checkoutUuid: randomUUID(),
                                                    userUuid: randomUUID(),
                                                    checkoutState: CheckoutStates.CHECKOUT_CREATED,
                                                    createdAt: new Date,
                                                    subTotal: 0,
                                                    updatedAt: new Date
                                                })
    })
    afterEach(()=> {
        factoryCtx = null
        checkoutDomainModel = null
    })
    describe('Checkout Constructor', () => {
        it('should return true when given all property valid', () => {
            let checkout: CheckoutInterface = new Checkout(
                new CheckoutID(randomUUID()),
                new CustomerID(randomUUID()),
                new CheckoutState(CheckoutStates.CHECKOUT_CREATED),
                new Date,
                new Date,
                new Map<string, CheckoutItemInterface>,
            )
            expect(checkout).toBeTruthy()
            expect(checkout.getCheckoutItems()).toBeInstanceOf(Map<string, CheckoutItemInterface>)
            expect(checkout.getCheckoutState().getState()).toBe('CHECKOUT_CREATED')
            
        })
        it('should return true when given without optional parameters', () => {
            let checkout: CheckoutInterface = new Checkout(
                                                                new CheckoutID(randomUUID()),
                                                                new CustomerID(randomUUID()),
                                                                new CheckoutState(CheckoutStates.CHECKOUT_CREATED),
                                                                new Date,
                                                                new Date)
                expect(checkout).toBeTruthy()
                expect(checkout.getCheckoutItems()).toBeInstanceOf(Map<string, CheckoutItemInterface>)
                expect(checkout.getCheckoutState().getState()).toBe('CHECKOUT_CREATED')
    
        })
        
    })
    
    describe('Checkout Factories', () => {
        describe('NullableCheckoutFactory', () => {
            it('should return concreate Chekout instance', () => {
                let checkout = factoryCtx.setFactoryMethod(NullableCheckoutFactory.name)
                                        .createInstance<CheckoutInterface, CheckoutConstructorParamaters>({
                    checkoutUuid: randomUUID(),
                    userUuid: randomUUID(),
                    checkoutState: CheckoutStates.CHECKOUT_CREATED,
                    createdAt: new Date,
                    
                    updatedAt: new Date
                })
                expect(checkout).toBeInstanceOf(Checkout)
                expect(checkout).toBeTruthy()
            })
            
            it('should return NullCheckout when given null to any property', () => {
                const checkout = factoryCtx.setFactoryMethod(NullableCheckoutFactory.name)
                                        .createInstance<CheckoutInterface, CheckoutConstructorParamaters>({
                                            checkoutUuid: randomUUID(),
                                            userUuid: randomUUID(),
                                            checkoutState: null,
                                            createdAt: new Date,
                                            
                                            updatedAt: new Date
                                        })
                expect(checkout).toBeInstanceOf(NullCheckout)
            })
        })
        describe('ConcreateCheckoutFactory', () => {
            it('should return concreate Checkout instance', () => {
                let checkout = factoryCtx.setFactoryMethod(ConcreteCheckoutFactory.name)
                                        .createInstance<CheckoutInterface, CheckoutConstructorParamaters>({
                                            checkoutUuid: randomUUID(),
                                            userUuid: randomUUID(),
                                            checkoutState: CheckoutStates.CHECKOUT_CREATED,
                                            createdAt: new Date,
                                            updatedAt: new Date
                                        })
                
                expect(checkout).toBeTruthy()
                expect(checkout.getCheckoutItems().size).toBe(0)
            })
            it('should throw NullPropertyException exception when given null', () => {
                expect(() => factoryCtx.setFactoryMethod(ConcreteCheckoutFactory.name)
                                    .createInstance<CheckoutInterface, CheckoutConstructorParamaters>({
                                        checkoutUuid: randomUUID(),
                                        userUuid: randomUUID(),
                                        checkoutState: null,
                                        createdAt: new Date,
                                     
                                        updatedAt: new Date
                })).toThrow(NullPropertyException)
            })
        })

        describe('Checkout Methods', () => {
            describe('Checkout::addAnItem', () => {
                it('should return correct sub total and Map size when given an concreate item to parameter', () => {
                    const checkoutItem = factoryCtx.setFactoryMethod(ConcreateCheckoutItemFactory.name)
                                                .createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({
                                                    checkoutItemUuid: randomUUID(),
                                                    checkoutUuid: randomUUID(),
                                                    createdAt: new Date,
                                                    productBasePrice: 123,
                                                    productHeader: "Deneme",
                                                    productQuantity: 1,
                                                    productUuid: randomUUID(),
                                                    updatedAt: new Date
                                                })
                    checkoutDomainModel.addAnItem(checkoutItem)

                    
                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(1)
                })
                it('should return correct sub total, quantity and Map size when given same three concreate item to parameter', () => {
                    let checkoutItemUuid = randomUUID()
                    const checkoutItem  = factoryCtx.setFactoryMethod(ConcreateCheckoutItemFactory.name).createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({    checkoutItemUuid: checkoutItemUuid,    checkoutUuid: checkoutDomainModel.getUuid().getUuid(),    createdAt: new Date,    productBasePrice: 123,    productHeader: "Deneme",    productQuantity: 1,    productUuid: randomUUID(),    updatedAt: new Date})
                    const checkoutItem2 = factoryCtx.setFactoryMethod(ConcreateCheckoutItemFactory.name).createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({    checkoutItemUuid: checkoutItemUuid,    checkoutUuid: checkoutDomainModel.getUuid().getUuid(),    createdAt: new Date,    productBasePrice: 123,    productHeader: "Deneme",    productQuantity: 1,    productUuid: randomUUID(),    updatedAt: new Date})
                    const checkoutItem3 = factoryCtx.setFactoryMethod(ConcreateCheckoutItemFactory.name).createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({    checkoutItemUuid: checkoutItemUuid,    checkoutUuid: checkoutDomainModel.getUuid().getUuid(),    createdAt: new Date,    productBasePrice: 123,    productHeader: "Deneme",    productQuantity: 1,    productUuid: randomUUID(),    updatedAt: new Date})

                    checkoutDomainModel.addAnItem(checkoutItem)
                    checkoutDomainModel.addAnItem(checkoutItem2)
                    checkoutDomainModel.addAnItem(checkoutItem3)
                    
                    let checkoutItems = checkoutDomainModel.getCheckoutItems()
                    let item = checkoutItems.get(checkoutItemUuid)

                    expect(item.getProductQuantity().getQuantity()).toBe(3)
                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(1)
                    
                })
            })
            describe('Checkout::addItemOneMoreThan', () => {
                it('should return correct sub total, quantity and Map size when given same item uuid and quantity', () => {
                    let checkoutItemUuid = randomUUID()
                    const checkoutItem = factoryCtx.setFactoryMethod(ConcreateCheckoutItemFactory.name).createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({    checkoutItemUuid: checkoutItemUuid,    checkoutUuid: checkoutDomainModel.getUuid().getUuid(),    createdAt: new Date,    productBasePrice: 123,    productHeader: "Deneme",    productQuantity: 1,    productUuid: randomUUID(),    updatedAt: new Date})
                    checkoutDomainModel.addAnItem(checkoutItem)
                    checkoutDomainModel.addItemOneMoreThan(new CheckoutItemID(checkoutItemUuid), new ProductQuantity(3))
                    
                    let checkoutItems = checkoutDomainModel.getCheckoutItems()
                    let item = checkoutItems.get(checkoutItemUuid)

                    expect(item.getProductQuantity().getQuantity()).toBe(4)
                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(1)
                  

                })                
                
                it('should throw CheckoutItemNotFoundException when given not exist item uuid', () => {
                    expect(() => checkoutDomainModel.addItemOneMoreThan(new CheckoutItemID(randomUUID()), new ProductQuantity(3)))
                        .toThrow(CheckoutItemNotFoundException)  
                })

                it('should return correct sub total, quantity and Map size when given same item uuid and just one quantity', () => {
                    let checkoutItemUuid = randomUUID()
                    const checkoutItem = factoryCtx.setFactoryMethod(ConcreateCheckoutItemFactory.name).createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({    checkoutItemUuid: checkoutItemUuid,    checkoutUuid: checkoutDomainModel.getUuid().getUuid(),    createdAt: new Date,    productBasePrice: 123,    productHeader: "Deneme",    productQuantity: 1,    productUuid: randomUUID(),    updatedAt: new Date})

                    checkoutDomainModel.addAnItem(checkoutItem)
                    checkoutDomainModel.addItemOneMoreThan(new CheckoutItemID(checkoutItemUuid), new ProductQuantity(1))
                    
                    let checkoutItems = checkoutDomainModel.getCheckoutItems()
                    let item = checkoutItems.get(checkoutItemUuid)

                    expect(item.getProductQuantity().getQuantity()).toBe(2)
                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(1)
                    
                })
            })

            describe('Checkout::takeOutAnItem', () => {
                it('should return correct sub total and Map size when given an item uuid', () => {
                    let checkoutItemUuid = randomUUID()
                    const checkoutItem = factoryCtx.setFactoryMethod(ConcreateCheckoutItemFactory.name).createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({    checkoutItemUuid: checkoutItemUuid,    checkoutUuid: checkoutDomainModel.getUuid().getUuid(),    createdAt: new Date,    productBasePrice: 123,    productHeader: "Deneme",    productQuantity: 1,    productUuid: randomUUID(),    updatedAt: new Date})
                    
                    checkoutDomainModel.addAnItem(checkoutItem)
                    checkoutDomainModel.takeOutAnItem(new CheckoutItemID(checkoutItemUuid))

                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(0)
                    
                })
                it('should return correct sub total, quantity and Map size when given same items uuid', () => {
                    let checkoutItemUuid = randomUUID()
                    const checkoutItem = factoryCtx.setFactoryMethod(ConcreateCheckoutItemFactory.name).createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({    checkoutItemUuid: checkoutItemUuid,    checkoutUuid: checkoutDomainModel.getUuid().getUuid(),    createdAt: new Date,    productBasePrice: 123,    productHeader: "Deneme",    productQuantity: 1,    productUuid: randomUUID(),    updatedAt: new Date})

                    checkoutDomainModel.addAnItem(checkoutItem)
                    checkoutDomainModel.addAnItem(checkoutItem)
                    checkoutDomainModel.addAnItem(checkoutItem)
                    
                    checkoutDomainModel.takeOutAnItem(new CheckoutItemID(checkoutItemUuid))

                    let checkoutItems = checkoutDomainModel.getCheckoutItems()
                    let item = checkoutItems.get(checkoutItemUuid)

                    expect(item.getProductQuantity().getQuantity()).toBe(2)
                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(1)
                })
                
                it('should throw CheckoutItemNotFoundException when given not exist item uuid', () => {
                    expect(() => checkoutDomainModel.takeOutAnItem(new CheckoutItemID(randomUUID())))
                        .toThrow(CheckoutItemNotFoundException)  
                })
            })

            describe('Checkout::takeOutOneMoreThanItem', () => {
                it('should return correct sub total, quantity and Map size when given same items uuid and quantity', () => {
                    let checkoutItemUuid = randomUUID()
                    const checkoutItem = factoryCtx.setFactoryMethod(ConcreateCheckoutItemFactory.name).createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({    checkoutItemUuid: checkoutItemUuid,    checkoutUuid: checkoutDomainModel.getUuid().getUuid(),    createdAt: new Date,    productBasePrice: 123,    productHeader: "Deneme",    productQuantity: 1,    productUuid: randomUUID(),    updatedAt: new Date})

                    checkoutDomainModel.addAnItem(checkoutItem)
                    checkoutDomainModel.addAnItem(checkoutItem)
                    checkoutDomainModel.addAnItem(checkoutItem)
                    
                    checkoutDomainModel.takeOutOneMoreThanItem(new CheckoutItemID(checkoutItemUuid), new ProductQuantity(2))

                    let checkoutItems = checkoutDomainModel.getCheckoutItems()
                    let item = checkoutItems.get(checkoutItemUuid)

                    expect(item.getProductQuantity().getQuantity()).toBe(1)
                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(1)
                   
                })

                it('should return correct sub total and Map size when given same items uuid and more than actual quantity', () => {
                    let checkoutItemUuid = randomUUID()
                    const checkoutItem = factoryCtx.setFactoryMethod(ConcreateCheckoutItemFactory.name).createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({    checkoutItemUuid: checkoutItemUuid,    checkoutUuid: checkoutDomainModel.getUuid().getUuid(),    createdAt: new Date,    productBasePrice: 123,    productHeader: "Deneme",    productQuantity: 1,    productUuid: randomUUID(),    updatedAt: new Date})

                    checkoutDomainModel.addAnItem(checkoutItem)
                    checkoutDomainModel.addAnItem(checkoutItem)
                    checkoutDomainModel.addAnItem(checkoutItem)
                    
                    checkoutDomainModel.takeOutOneMoreThanItem(new CheckoutItemID(checkoutItemUuid), new ProductQuantity(10))

                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(0)
                  

                })
                it('should throw CheckoutItemNotFoundException when given not exist item uuid', () => {
                    expect(() => checkoutDomainModel.takeOutOneMoreThanItem(new CheckoutItemID(randomUUID()), new ProductQuantity(3)))
                        .toThrow(CheckoutItemNotFoundException)  
                })
            })

            describe('Checkout::takeOutSameItems', () => {
                it('should return correct sub total and Map size when given same items uuid', () => {
                    let checkoutItemUuid = randomUUID()
                    const checkoutItem = factoryCtx.setFactoryMethod(ConcreateCheckoutItemFactory.name).createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({    checkoutItemUuid: checkoutItemUuid,    checkoutUuid: checkoutDomainModel.getUuid().getUuid(),    createdAt: new Date,    productBasePrice: 123,    productHeader: "Deneme",    productQuantity: 1,    productUuid: randomUUID(),    updatedAt: new Date})

                    checkoutDomainModel.addAnItem(checkoutItem)
                    checkoutDomainModel.addAnItem(checkoutItem)
                    checkoutDomainModel.addAnItem(checkoutItem)
                    
                    checkoutDomainModel.takeOutSameItems(new CheckoutItemID(checkoutItemUuid))

                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(0)
                    
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
                    
                    const checkoutItem = factoryCtx.setFactoryMethod(ConcreateCheckoutItemFactory.name).createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({    checkoutItemUuid: checkoutItemUuid,    checkoutUuid: checkoutDomainModel.getUuid().getUuid(),    createdAt: new Date,    productBasePrice: 123,    productHeader: "Deneme",    productQuantity: 1,    productUuid: productUuid,    updatedAt: new Date})

                    checkoutDomainModel.addAnItem(checkoutItem)
                    checkoutDomainModel.addAnItem(checkoutItem)
                    checkoutDomainModel.addAnItem(checkoutItem)

                   
                    expect(checkoutDomainModel.getCheckoutItems().size).toBe(1)
                    
                })

                it('should throw NegativeNumberException when given new price to negative value', () => {
                    let checkoutItemUuid = randomUUID()
                    let productUuid = randomUUID()
                    
                    const checkoutItem = factoryCtx.setFactoryMethod(ConcreateCheckoutItemFactory.name).createInstance<CheckoutItemInterface, CheckoutItemConstructorParameters>({    checkoutItemUuid: checkoutItemUuid,    checkoutUuid: checkoutDomainModel.getUuid().getUuid(),    createdAt: new Date,    productBasePrice: 123,    productHeader: "Deneme",    productQuantity: 1,    productUuid: productUuid,    updatedAt: new Date})

                    checkoutDomainModel.addAnItem(checkoutItem)
                    checkoutDomainModel.addAnItem(checkoutItem)
                    checkoutDomainModel.addAnItem(checkoutItem)

                   
                })
            })

            describe('Checkout::cancelThisCheckout', () => {
                it('should be CHECKOUT_CANCELLED when calling method', () => {
                    let expected = 'CHECKOUT_CANCELLED'
                    checkoutDomainModel.cancelThisCheckout()
                    expect(checkoutDomainModel.getCheckoutState().getState()).toBe(expected)
                })
            })

           
        })
    })
})