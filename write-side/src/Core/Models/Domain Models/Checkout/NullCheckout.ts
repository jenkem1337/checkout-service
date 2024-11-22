import CheckoutID from '../../ValueObjects/CheckoutID';
import CheckoutItemID from '../../ValueObjects/CheckoutItemID';
import CheckoutState from '../../ValueObjects/CheckoutState';
import CustomerID from '../../ValueObjects/CustomerID';
import ProductQuantity from '../../ValueObjects/ProductQuantity';
import CheckoutInterface from './CheckoutInterface';
import CheckoutItemInterface from './CheckoutItemInterface';
import NullObjectException from '../../../Exceptions/NullObjectException';
export default class NullCheckout implements CheckoutInterface {
    isCheckoutCancelled(): void {
        throw new NullObjectException
    }
    addAnItem(item: CheckoutItemInterface): void {
        throw new NullObjectException
    }
    addItemOneMoreThan(itemUuid: CheckoutItemID, itemQuantity: ProductQuantity): void {
        throw new NullObjectException
    }
    takeOutAnItem(uuid: CheckoutItemID): void {
        throw new NullObjectException
    }
    takeOutOneMoreThanItem(itemUuid: CheckoutItemID, itemQuantity: ProductQuantity): void {
        throw new NullObjectException
    }
    takeOutSameItems(itemUuid: CheckoutItemID): void {
        throw new NullObjectException
    }
   
    cancelThisCheckout(): void {
        throw new NullObjectException
    }
    completeThisCheckout(): void {
        throw new NullObjectException
    }
    
    getUserUuid(): CustomerID {
        throw new NullObjectException
    }
    
    getCheckoutState(): CheckoutState {
        throw new NullObjectException
    }
    getCheckoutItems(): Map<string, CheckoutItemInterface> {
        throw new NullObjectException
    }
    getUuid(): CheckoutID {
        throw new NullObjectException
    }
    getCreatedAt(): Date {
        throw new NullObjectException
    }
    getUpdatedAt(): Date {
        throw new NullObjectException
    }
    isNull(): boolean {
         return true
    }
    isNotNull(): boolean {
        return false
    }
    
}