import Address from '../../ValueObjects/Address';
import CheckoutID from '../../ValueObjects/CheckoutID';
import CheckoutItemID from '../../ValueObjects/CheckoutItemID';
import CheckoutState from '../../ValueObjects/CheckoutState';
import CustomerID from '../../ValueObjects/CustomerID';
import Money from '../../ValueObjects/Money';
import PeymentMethod from '../../ValueObjects/PeymentMethod';
import ProductID from '../../ValueObjects/ProductID';
import ProductQuantity from '../../ValueObjects/ProductQuantity';
import CheckoutInterface from './CheckoutInterface';
import CheckoutItemInterface from './CheckoutItemInterface';
import NullObjectException from '../../../Exceptions/NullObjectException';
export default class NullCheckout implements CheckoutInterface {
    isCheckoutCancelled(): void {
        throw new NullObjectException
    }
    setPeymentMethod(peymentMethod: () => PeymentMethod): void {
        throw new NullObjectException
    }
    setShippingPrice(shippingPrice: () => Money): void {
        throw new NullObjectException
    }
    setShippingAddress(address: () => Address): void {
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
    updateItemPrices(itemUuid: ProductID, newPrices: Money): void {
        throw new NullObjectException
    }
    calculateSubTotal(): void {
        throw new NullObjectException
    }
    cancelThisCheckout(): void {
        throw new NullObjectException
    }
    completeThisCheckout(): void {
        throw new NullObjectException
    }
    getSubTotal(): Money {
        throw new NullObjectException
    }
    getUserUuid(): CustomerID {
        throw new NullObjectException
    }
    getAddress(): Address {
        throw new NullObjectException
    }
    getShippingPrice(): Money {
        throw new NullObjectException
    }
    getPeymentMethod(): PeymentMethod {
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