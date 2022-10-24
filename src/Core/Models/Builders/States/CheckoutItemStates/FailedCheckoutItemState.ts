import CheckoutItem from '../../../Domain Models/Checkout/CheckoutItem';
import CheckoutItemInterface from '../../../Domain Models/Checkout/CheckoutItemInterface';
import CheckoutItemID from '../../../ValueObjects/CheckoutItemID';
import Money from '../../../ValueObjects/Money';
import ProductHeader from '../../../ValueObjects/ProductHeader';
import ProductID from '../../../ValueObjects/ProductID';
import ProductQuantity from '../../../ValueObjects/ProductQuantity';
import BaseCheckoutItemBuilderState from './BaseCheckoutItemBuilderState';
import NullCheckoutItem from '../../../Domain Models/Checkout/NullCheckoutItem';
import CheckoutID from '../../../ValueObjects/CheckoutID';

export default class FailedCheckoutItemState extends BaseCheckoutItemBuilderState {
    
    checkoutUuid(uuid: () => CheckoutID): void {
        this.context.build()
    }
    
    checkoutItemUuid(itemUuid: () => ProductID): void {
        this.context.build()
    }
    
    checkoutProductHeader(itemHeader: () => ProductHeader): void {
        this.context.build()
    }
    
    checkoutProductBasePrice(itemBasePrice: () => Money): void {
        this.context.build()
    }
    
    checkoutProductQuantity(itemQuantity: () => ProductQuantity): void {
        this.context.build()
    }
    checkoutProductUuid(productUuid: () => ProductID): void {
        this.context.build()
    }
    checkoutCreatedAt(date: Date): void {
        this.context.build()
    }
    
    checkoutUpdatedAt(date: Date): void {
        this.context.build()
    }
    
    build(): CheckoutItemInterface {
        return new NullCheckoutItem
    }
    
}