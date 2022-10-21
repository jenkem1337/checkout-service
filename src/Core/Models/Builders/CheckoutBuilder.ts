import Address from '../ValueObjects/Address';
import CheckoutID from '../ValueObjects/CheckoutID';
import CustomerID from '../ValueObjects/CustomerID';
import Money from '../ValueObjects/Money';
import PeymentMethod from '../ValueObjects/PeymentMethod';
import BaseCheckoutBuilderState from './States/CheckoutAggregateStates/BaseCheckoutBuilderState';
import Builder from './Builder';
import Checkout from '../Domain Models/Checkout/Checkout';
import CheckoutInterface from '../Domain Models/Checkout/CheckoutInterface';
export default class CheckoutBuilder implements Builder<CheckoutInterface>{
    public  _uuid:CheckoutID
    public _userUuid: CustomerID
    public _address: Address
    public _subTotal: Money
    public _shippingPrice: Money
    public _paymentMethod: PeymentMethod
    private state: BaseCheckoutBuilderState
    
    private constructor(initialState: BaseCheckoutBuilderState) {
        this.setState(initialState)
    }

    private setState(state: BaseCheckoutBuilderState){
        this.state = state
        this.state.setContext(this)
    }
    initBuilder(initialState:BaseCheckoutBuilderState):CheckoutBuilder {
        return new CheckoutBuilder(initialState)
    }
    checkoutUuid(uuid:() => CheckoutID):CheckoutBuilder{
        this.state.checkoutUuid(uuid)
        return this
    }
    userUuid(userUuid: () => CustomerID){
        this.state.userUuid(userUuid)
        return this
    }
    address(shippingAddress: () => Address){
        this.state.address(shippingAddress)
        return this
    }
    subTotal(subTotal: () => Money){
        this.state.subTotal(subTotal)
        return this
    }
    shippingPrice(shippingPrice: () => Money){
        this.state.shippingPrice(shippingPrice)
        return this
    }
    peymentMethod(peymentMethod: () => PeymentMethod) {
        this.state.peymentMethod(peymentMethod)
        return this
    }
    build(): CheckoutInterface {
        return this.state.build()
    }


}