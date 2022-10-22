import CheckoutItem from '../../Domain Models/Checkout/CheckoutItem';
import CheckoutItemInterface from '../../Domain Models/Checkout/CheckoutItemInterface';
import CheckoutID from '../../ValueObjects/CheckoutID';
import CheckoutItemID from '../../ValueObjects/CheckoutItemID';
import Money from '../../ValueObjects/Money';
import ProductHeader from '../../ValueObjects/ProductHeader';
import ProductID from '../../ValueObjects/ProductID';
import ProductQuantity from '../../ValueObjects/ProductQuantity';
import BaseCheckoutItemBuilderState from './BaseCheckoutItemBuilderState';

export default class ItMustBeConcreateCheckoutItemState extends BaseCheckoutItemBuilderState {
    
    checkoutItemUuid(itemUuid: () => CheckoutItemID): void {
        this.context.uuid = itemUuid()
    }
    checkoutUuid(checkoutUuid: () => CheckoutID): void {
        this.context._checkoutUuid = checkoutUuid()
    }
    
    checkoutProductUuid(productUuid: () => ProductID): void {
        this.context.productUuid = productUuid()
    }
    
    checkoutProductHeader(itemHeader: () => ProductHeader): void {
        this.context.productHeader = itemHeader()
    }
    
    checkoutProductBasePrice(itemBasePrice: () => Money): void {
        this.context.productBasePrice = itemBasePrice()
    }
    
    checkoutProductQuantity(itemQuantity: () => ProductQuantity): void {
        this.context.productQuantity = itemQuantity()
    }
    
    checkoutCreatedAt(date: Date): void {
        this.context.createdAt = date
    }
    
    checkoutUpdatedAt(date: Date): void {
        this.context.updatedAt = date
    }
    
    build(): CheckoutItemInterface {
        return new CheckoutItem(
            this.context.uuid,
            this.context._checkoutUuid,
            this.context.productUuid,
            this.context.productHeader,
            this.context.productBasePrice,
            this.context.productQuantity,
            this.context.createdAt,
            this.context.updatedAt
        ) 
    }
    
}