import CheckoutItem from '../../../Domain Models/Checkout/CheckoutItem';
import CheckoutItemInterface from '../../../Domain Models/Checkout/CheckoutItemInterface';
import CheckoutItemID from '../../../ValueObjects/CheckoutItemID';
import Money from '../../../ValueObjects/Money';
import ProductHeader from '../../../ValueObjects/ProductHeader';
import ProductID from '../../../ValueObjects/ProductID';
import ProductQuantity from '../../../ValueObjects/ProductQuantity';
import BaseCheckoutItemBuilderState from './BaseCheckoutItemBuilderState';
import FailedCheckoutItemState from './FailedCheckoutItemState';
import CheckoutID from '../../../ValueObjects/CheckoutID';

export default class CreateInstanceOfCheckoutItemState extends BaseCheckoutItemBuilderState {
    
    checkoutItemUuid(uuid: () => CheckoutItemID): void {
        try {
            
            this.context.uuid = uuid()
        } catch (error) {
            this.context.setState(new FailedCheckoutItemState)
        }
    }
    
    checkoutUuid(checkoutUuid: () => CheckoutID): void {
        try {
            
            this.context._checkoutUuid = checkoutUuid()
        } catch (error) {
            this.context.setState(new FailedCheckoutItemState)

        }
    }
    
    checkoutProductHeader(itemHeader: () => ProductHeader): void {
        try {
            this.context.productHeader = itemHeader()
            
        } catch (error) {
            this.context.setState(new FailedCheckoutItemState)

        }
    }
    
    checkoutProductBasePrice(itemBasePrice: () => Money): void {
        try {
            this.context.productBasePrice = itemBasePrice()
            
        } catch (error) {
            this.context.setState(new FailedCheckoutItemState)

        }
    }
    
    checkoutProductQuantity(itemQuantity: () => ProductQuantity): void {
        try {
            this.context.productQuantity = itemQuantity()
            
        } catch (error) {
            this.context.setState(new FailedCheckoutItemState)

        }
    }

    checkoutProductUuid(productUuid: () => ProductID): void {
        try {
            this.context.productUuid = productUuid()
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