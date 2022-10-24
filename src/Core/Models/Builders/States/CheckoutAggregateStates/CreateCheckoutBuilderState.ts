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
import FailedCheckoutBuilderState from './FailedCheckoutBuilderState';

export default class CreateInstanceOfCheckoutBuilderState extends BaseCheckoutBuilderState {
    checkoutUuid(uuid: () => CheckoutID): void {
        try {
            this.context._uuid = uuid()
        } catch (error) {
            this.context.setState(new FailedCheckoutBuilderState)
        }
    }
    userUuid(userUuid: () => CustomerID): void {
        try {
            this.context._userUuid = userUuid()
        } catch (error) {
            this.context.setState(new FailedCheckoutBuilderState)
        }
    }
    address(shippingAddress: () => Address): void {
        try {
            this.context._address = shippingAddress()
        } catch (error) {
            this.context.setState(new FailedCheckoutBuilderState)
        }
    }
    subTotal(subTotal: () => Money): void {
        try {
            this.context._subTotal = subTotal()
        } catch (error) {
            this.context.setState(new FailedCheckoutBuilderState)
        }
    }
    shippingPrice(shippingPrice: () => Money): void {
        try {
            this.context._shippingPrice = shippingPrice()
        } catch (error) {
            this.context.setState(new FailedCheckoutBuilderState)
        }
    }
    peymentMethod(peymentMethod: () => PeymentMethod): void {
        try {
            this.context._paymentMethod = peymentMethod()
        } catch (error) {
            this.context.setState(new FailedCheckoutBuilderState)
        }
    }
    checkoutState(checkoutState: () => CheckoutState): void {
        try {
            this.context._checkoutState = checkoutState()
        } catch (error) {
            this.context.setState(new FailedCheckoutBuilderState)
        }
    }
    checkoutItemsMap(checkoutItems: Map<string, CheckoutItemInterface>): void {
        try {
            this.context._checkoutItemsMap = checkoutItems
        } catch (error) {
            this.context.setState(new FailedCheckoutBuilderState)
        }
    }
    createdAt(date: Date): void {
        try {
            this.context._createdAt = date
        } catch (error) {
            this.context.setState(new FailedCheckoutBuilderState)
        }
    }
    updatedAt(date: Date): void {
        try {
            this.context._updatedAt = date
        } catch (error) {
            this.context.setState(new FailedCheckoutBuilderState)
        }
    }
    build(): CheckoutInterface {
        return new Checkout(
            this.context._uuid,
            this.context._userUuid,
            this.context._address,
            this.context._subTotal,
            this.context._shippingPrice,
            this.context._paymentMethod,
            this.context._checkoutState,
            this.context._createdAt,
            this.context._updatedAt,
            this.context._checkoutItemsMap
        )
    }
    
}