import CheckoutItem from '../../Domain Models/CheckoutItem';
import CheckoutItemInterface from '../../Domain Models/CheckoutItemInterface';
import CheckoutItemID from '../../ValueObjects/CheckoutItemID';
import Money from '../../ValueObjects/Money';
import ProductHeader from '../../ValueObjects/ProductHeader';
import ProductID from '../../ValueObjects/ProductID';
import ProductQuantity from '../../ValueObjects/ProductQuantity';
import BaseCheckoutItemBuilderState from './BaseCheckoutItemBuilderState';

export default class ItMustBeConcreateCheckoutItemState extends BaseCheckoutItemBuilderState {
    
    checkoutUuid(uuid: () => CheckoutItemID): void {
        this.context.uuid = uuid()
    }
    
    checkoutItemUuid(itemUuid: () => ProductID): void {
        this.context.itemUuid = itemUuid()
    }
    
    checkoutItemHeader(itemHeader: () => ProductHeader): void {
        this.context.itemHeader = itemHeader()
    }
    
    checkoutItemBasePrice(itemBasePrice: () => Money): void {
        this.context.itemBasePrice = itemBasePrice()
    }
    
    checkoutItemQuantity(itemQuantity: () => ProductQuantity): void {
        this.context.itemQuantity = itemQuantity()
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
            this.context.itemUuid,
            this.context.itemHeader,
            this.context.itemBasePrice,
            this.context.itemQuantity,
            this.context.createdAt,
            this.context.updatedAt
        ) 
    }
    
}