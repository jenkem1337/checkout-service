import CheckoutInterface from '../../../Domain Models/Checkout/CheckoutInterface';
import CheckoutItemInterface from '../../../Domain Models/Checkout/CheckoutItemInterface';
import Address from '../../../ValueObjects/Address';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import CheckoutState from '../../../ValueObjects/CheckoutState';
import CustomerID from '../../../ValueObjects/CustomerID';
import Money from '../../../ValueObjects/Money';
import PeymentMethod from '../../../ValueObjects/PeymentMethod';
import BaseCheckoutBuilderState from './BaseCheckoutBuilderState';
import Checkout from '../../../Domain Models/Checkout/Checkout';
export default class ItMustBeConcreteCheckoutBuilderState extends BaseCheckoutBuilderState {
    checkoutUuid(uuid: () => CheckoutID): void {
        this.context._uuid = uuid()
    }
    userUuid(userUuid: () => CustomerID): void {
        this.context._userUuid = userUuid()
    }
    address(shippingAddress: Address): void {
        this.context._address = shippingAddress
    }
    subTotal(subTotal: () => Money): void {
        this.context._subTotal = subTotal()
    }
    shippingPrice(shippingPrice:  Money): void {
        this.context._shippingPrice = shippingPrice
    }
    peymentMethod(peymentMethod:PeymentMethod): void {
        this.context._paymentMethod = peymentMethod
    }
    checkoutState(checkoutState: () => CheckoutState): void {
        this.context._checkoutState = checkoutState()
    }
    checkoutItemsMap(checkoutItems: Map<string, CheckoutItemInterface>): void {
        this.context._checkoutItemsMap = checkoutItems
    }
    createdAt(date: Date): void {
        this.context._createdAt = date
    }
    updatedAt(date: Date): void {
        this.context._updatedAt = date
    }
    build(): CheckoutInterface {
        return new Checkout(
            this.context._uuid,
            this.context._userUuid,
            this.context._subTotal,
            this.context._checkoutState,
            this.context._createdAt,
            this.context._updatedAt,
            this.context._checkoutItemsMap,
            this.context._address,
            this.context._paymentMethod,
            this.context._shippingPrice
        )
    }
    
}