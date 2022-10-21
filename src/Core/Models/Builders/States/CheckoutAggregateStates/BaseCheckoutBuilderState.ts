import CheckoutBuilder from '../../CheckoutBuilder';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import CustomerID from '../../../ValueObjects/CustomerID';
import Address from '../../../ValueObjects/Address';
import Money from '../../../ValueObjects/Money';
import PeymentMethod from '../../../ValueObjects/PeymentMethod';
import CheckoutInterface from '../../../Domain Models/Checkout/CheckoutInterface';
export default abstract class BaseCheckoutBuilderState {
    protected context: CheckoutBuilder

    setContext(ctx:CheckoutBuilder) {
        this.context = ctx
    }
    abstract checkoutUuid(uuid: () => CheckoutID):void
    abstract userUuid(userUuid: () => CustomerID):void
    abstract address(shippingAddress: () => Address):void
    abstract subTotal(subTotal: () => Money):void
    abstract shippingPrice(shippingPrice: () => Money):void
    abstract peymentMethod(peymentMethod: () => PeymentMethod):void
    abstract build():CheckoutInterface
}