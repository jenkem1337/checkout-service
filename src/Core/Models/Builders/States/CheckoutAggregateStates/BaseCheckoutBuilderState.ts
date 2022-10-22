import CheckoutBuilder from '../../CheckoutBuilder';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import CustomerID from '../../../ValueObjects/CustomerID';
import Address from '../../../ValueObjects/Address';
import Money from '../../../ValueObjects/Money';
import PeymentMethod from '../../../ValueObjects/PeymentMethod';
import CheckoutInterface from '../../../Domain Models/Checkout/CheckoutInterface';
import CheckoutState from '../../../ValueObjects/CheckoutState';
import CheckoutItemInterface from '../../../Domain Models/Checkout/CheckoutItemInterface';
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
    abstract checkoutState(checkoutState: () => CheckoutState):void
    abstract checkoutItemsMap(checkoutItems:Map<string, CheckoutItemInterface>):void
    abstract createdAt(date: Date):void
    abstract updatedAt(date: Date):void
    abstract build():CheckoutInterface
}