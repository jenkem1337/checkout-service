import CheckoutInterface from 'src/Core/Models/Domain Models/Checkout/CheckoutInterface';
import CheckoutItemInterface from 'src/Core/Models/Domain Models/Checkout/CheckoutItemInterface';
import Address from 'src/Core/Models/ValueObjects/Address';
import CheckoutID from 'src/Core/Models/ValueObjects/CheckoutID';
import CheckoutState from 'src/Core/Models/ValueObjects/CheckoutState';
import CustomerID from 'src/Core/Models/ValueObjects/CustomerID';
import Money from 'src/Core/Models/ValueObjects/Money';
import PeymentMethod from 'src/Core/Models/ValueObjects/PeymentMethod';
import BaseCheckoutBuilderState from './BaseCheckoutBuilderState';
import NullCheckout from '../../../Domain Models/Checkout/NullCheckout';
export default class FailedCheckoutBuilderState extends BaseCheckoutBuilderState {
    checkoutUuid(uuid: () => CheckoutID): void {
        this.context.build()
    }
    userUuid(userUuid: () => CustomerID): void {
        this.context.build()
    }
    address(shippingAddress: Address): void {
        this.context.build()
    }
    subTotal(subTotal: () => Money): void {
        this.context.build()
    }
    shippingPrice(shippingPrice: Money): void {
        this.context.build()
    }
    peymentMethod(peymentMethod: PeymentMethod): void {
        this.context.build()
    }
    checkoutState(checkoutState: () => CheckoutState): void {
        this.context.build()
    }
    checkoutItemsMap(checkoutItems: Map<string, CheckoutItemInterface>): void {
        this.context.build()
    }
    createdAt(date: Date): void {
        this.context.build()
    }
    updatedAt(date: Date): void {
        this.context.build()
    }
    build(): CheckoutInterface {
        return new NullCheckout
    }
    
}