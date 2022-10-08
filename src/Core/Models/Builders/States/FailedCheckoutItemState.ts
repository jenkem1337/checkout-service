import CheckoutItem from '../../Domain Models/CheckoutItem';
import CheckoutItemInterface from '../../Domain Models/CheckoutItemInterface';
import CheckoutItemID from '../../ValueObjects/CheckoutItemID';
import Money from '../../ValueObjects/Money';
import ProductHeader from '../../ValueObjects/ProductHeader';
import ProductID from '../../ValueObjects/ProductID';
import ProductQuantity from '../../ValueObjects/ProductQuantity';
import BaseCheckoutItemBuilderState from './BaseCheckoutItemBuilderState';
import NullCheckoutItem from '../../Domain Models/NullCheckoutItem';

export default class FailedCheckoutItemState extends BaseCheckoutItemBuilderState {
    
    checkoutUuid(uuid: () => CheckoutItemID): void {
        this.context.build()
    }
    
    checkoutItemUuid(itemUuid: () => ProductID): void {
        this.context.build()
    }
    
    checkoutItemHeader(itemHeader: () => ProductHeader): void {
        this.context.build()
    }
    
    checkoutItemBasePrice(itemBasePrice: () => Money): void {
        this.context.build()
    }
    
    checkoutItemQuantity(itemQuantity: () => ProductQuantity): void {
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