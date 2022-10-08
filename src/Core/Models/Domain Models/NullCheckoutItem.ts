import CheckoutItemID from '../ValueObjects/CheckoutItemID';
import Money from '../ValueObjects/Money';
import ProductHeader from '../ValueObjects/ProductHeader';
import ProductID from '../ValueObjects/ProductID';
import ProductQuantity from '../ValueObjects/ProductQuantity';
import CheckoutItemInterface from './CheckoutItemInterface';
import NullObjectException from '../../Exceptions/NullObjectException';
export default class NullCheckoutItem implements CheckoutItemInterface {
    changeItemBasePrice(newBasePrice: number): void {
        throw new NullObjectException
    }
    incraseQuantity(quantity: number): void {
        throw new NullObjectException
    }
    decreaseQuantity(quantity: number): void {
        throw new NullObjectException
    }
    getItemUuid(): ProductID {
        throw new NullObjectException();
    }
    getItemBasePrice(): Money {
        throw new NullObjectException();
    }
    getItemQuantity(): ProductQuantity {
        throw new NullObjectException();
    }
    getItemHeader(): ProductHeader {
        throw new NullObjectException();
    }
    getUuid(): CheckoutItemID {
        throw new NullObjectException();
    }
    getCreatedAt(): Date {
        throw new NullObjectException();
    }
    getUpdatedAt(): Date {
        throw new NullObjectException();
    }
    isNull(): boolean {
        return true
    }
    isNotNull(): boolean {
        return false
    }
    
}