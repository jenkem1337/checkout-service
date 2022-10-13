import CheckoutItemID from '../../ValueObjects/CheckoutItemID';
import Money from '../../ValueObjects/Money';
import ProductHeader from '../../ValueObjects/ProductHeader';
import ProductID from '../../ValueObjects/ProductID';
import ProductQuantity from '../../ValueObjects/ProductQuantity';
import CheckoutItemInterface from './CheckoutItemInterface';
import NullObjectException from '../../../Exceptions/NullObjectException';
import CheckoutID from '../../ValueObjects/CheckoutID';
export default class NullCheckoutItem implements CheckoutItemInterface {
    changeProductBasePrice(newBasePrice: number): void {
        throw new NullObjectException
    }
    incraseQuantity(quantity: number): void {
        throw new NullObjectException
    }
    decreaseQuantity(quantity: number): void {
        throw new NullObjectException
    }
    getProductUuid(): ProductID {
        throw new NullObjectException();
    }
    getProductBasePrice(): Money {
        throw new NullObjectException();
    }
    getProductQuantity(): ProductQuantity {
        throw new NullObjectException();
    }
    getProductHeader(): ProductHeader {
        throw new NullObjectException();
    }
    getUuid(): CheckoutItemID {
        throw new NullObjectException();
    }
    getCheckoutUuid(): CheckoutID {
        throw new NullObjectException()
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