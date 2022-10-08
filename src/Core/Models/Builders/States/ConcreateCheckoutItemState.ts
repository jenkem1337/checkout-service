import CheckoutItem from '../../Domain Models/CheckoutItem';
import CheckoutItemInterface from '../../Domain Models/CheckoutItemInterface';
import CheckoutItemID from '../../ValueObjects/CheckoutItemID';
import Money from '../../ValueObjects/Money';
import ProductHeader from '../../ValueObjects/ProductHeader';
import ProductID from '../../ValueObjects/ProductID';
import ProductQuantity from '../../ValueObjects/ProductQuantity';
import BaseCheckoutItemBuilderState from './BaseCheckoutItemBuilderState';
import FailedCheckoutItemState from './FailedCheckoutItemState';

export default class ConcreateCheckoutItemState extends BaseCheckoutItemBuilderState {
    
    checkoutUuid(uuid: () => CheckoutItemID): void {
        try {
            
            this.context.uuid = uuid()
        } catch (error) {
            this.context.setState(new FailedCheckoutItemState)
        }
    }
    
    checkoutItemUuid(itemUuid: () => ProductID): void {
        try {
            
            this.context.itemUuid = itemUuid()
        } catch (error) {
            this.context.setState(new FailedCheckoutItemState)

        }
    }
    
    checkoutItemHeader(itemHeader: () => ProductHeader): void {
        try {
            this.context.itemHeader = itemHeader()
            
        } catch (error) {
            this.context.setState(new FailedCheckoutItemState)

        }
    }
    
    checkoutItemBasePrice(itemBasePrice: () => Money): void {
        try {
            this.context.itemBasePrice = itemBasePrice()
            
        } catch (error) {
            this.context.setState(new FailedCheckoutItemState)

        }
    }
    
    checkoutItemQuantity(itemQuantity: () => ProductQuantity): void {
        try {
            this.context.itemQuantity = itemQuantity()
            
        } catch (error) {
            this.context.setState(new FailedCheckoutItemState)

        }
    }
    
    checkoutCreatedAt(date: Date): void {
        try {
            
            this.context.createdAt = date
        } catch (error) {
            this.context.setState(new FailedCheckoutItemState)

        }
    }
    
    checkoutUpdatedAt(date: Date): void {
        try {
            this.context.updatedAt = date
            
        } catch (error) {
            this.context.setState(new FailedCheckoutItemState)
        }
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