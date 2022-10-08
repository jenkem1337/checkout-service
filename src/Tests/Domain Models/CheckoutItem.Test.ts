import CheckoutItemID from '../../Core/Models/ValueObjects/CheckoutItemID';
import CheckoutItem from '../../Core/Models/Domain Models/CheckoutItem';
import { randomUUID } from 'crypto';
import ProductID from '../../Core/Models/ValueObjects/ProductID';
import ProductHeader from '../../Core/Models/ValueObjects/ProductHeader';
import Money from '../../Core/Models/ValueObjects/Money';
import ProductQuantity from '../../Core/Models/ValueObjects/ProductQuantity';
import CheckoutItemBuilder from '../../Core/Models/Builders/CheckoutItemBuilder';
import CheckoutItemInterface from '../../Core/Models/Domain Models/CheckoutItemInterface';
import ItMustBeConcreateCheckoutItemState from '../../Core/Models/Builders/States/ItMustBeConcreateCheckoutItemState';
import NullCheckoutItem from '../../Core/Models/Domain Models/NullCheckoutItem';
import ConcreateCheckoutItemState from '../../Core/Models/Builders/States/ConcreateCheckoutItemState';

describe('CheckoutItem', () => {
    describe('CheckoutItem Constructor', () => {
        it('should return true when given valid properties', () => {
            const checkoutItem: CheckoutItemInterface = new CheckoutItem(
                new CheckoutItemID(randomUUID()),
                new ProductID(randomUUID()),
                new ProductHeader('Rolex Datejust 36mm Blue Dial Ref:126200'),
                new Money(169.554),
                new ProductQuantity(1),
                new Date,
                new Date
            )
            expect(checkoutItem).toBeTruthy()
        })

        it('should return true when given valid property with CheckoutItemBuilder', () =>{
            const checkoutItem:CheckoutItemInterface = CheckoutItemBuilder.initBuilder(new ItMustBeConcreateCheckoutItemState)
                                                    .checkoutUuid(() => new CheckoutItemID(randomUUID()))
                                                    .checkoutItemUuid(() => new ProductID(randomUUID()))
                                                    .checkoutItemHeader(() => new ProductHeader('Rolex Datejust 36mm Blue Dial Ref:126200'))
                                                    .checkoutItemBasePrice(() => new Money(169.554))
                                                    .checkoutItemQuantity(() => new ProductQuantity(1))
                                                    .checkoutCreatedAt(new Date)
                                                    .checkoutUpdatedAt(new Date)
                                                    .build()
            expect(checkoutItem).toBeTruthy()
            expect(checkoutItem.getItemQuantity().getQuantity()).toBe(1)
        })
        
         it('should return NullCheckoutItem when given invalid property in CheckoutItemBuilder', () => {
            const checkoutItem:CheckoutItemInterface = CheckoutItemBuilder.initBuilder(new ConcreateCheckoutItemState)
                                                        .checkoutUuid(() => new CheckoutItemID(randomUUID()))
                                                        .checkoutItemUuid(() => new ProductID(randomUUID()))
                                                        .checkoutItemHeader(() => new ProductHeader('Rolex Datejust 36mm Blue Dial Ref:126200'))
                                                        .checkoutItemBasePrice(() => new Money(-169.554))
                                                        .checkoutItemQuantity(() => new ProductQuantity(-1))
                                                        .checkoutCreatedAt(new Date)
                                                        .checkoutUpdatedAt(new Date)
                                                        .build()
            expect(checkoutItem).toBeInstanceOf(NullCheckoutItem)
            expect(checkoutItem.isNull()).toBe(true)})
        
        })
})