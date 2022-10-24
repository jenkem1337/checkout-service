import Address from '../ValueObjects/Address';
import CheckoutID from '../ValueObjects/CheckoutID';
import CustomerID from '../ValueObjects/CustomerID';
import Money from '../ValueObjects/Money';
import PeymentMethod from '../ValueObjects/PeymentMethod';
import BaseCheckoutBuilderState from './States/CheckoutAggregateStates/BaseCheckoutBuilderState';
import Builder from './Builder';
import CheckoutInterface from '../Domain Models/Checkout/CheckoutInterface';
import CheckoutState from '../ValueObjects/CheckoutState';
import CheckoutItemInterface from '../Domain Models/Checkout/CheckoutItemInterface';
export default class CheckoutBuilder implements Builder<CheckoutInterface>{
    public  _uuid:CheckoutID
    public _userUuid: CustomerID
    public _address: Address
    public _subTotal: Money
    public _shippingPrice: Money
    public _paymentMethod: PeymentMethod
    public _checkoutState: CheckoutState
    public _checkoutItemsMap: Map<string, CheckoutItemInterface>
    public _createdAt:Date
    public _updatedAt:Date
    private state: BaseCheckoutBuilderState
    
    private constructor(initialState: BaseCheckoutBuilderState) {
        this.setState(initialState)
    }

    setState(state: BaseCheckoutBuilderState){
        this.state = state
        this.state.setContext(this)
    }
    static initBuilder(initialState:BaseCheckoutBuilderState):CheckoutBuilder {
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
    checkoutState(state:() =>CheckoutState){
        this.state.checkoutState(state)
        return this
    }
    checkoutItemsMap(map: Map<string, CheckoutItemInterface>){
        this.state.checkoutItemsMap(map)
        return this
    }
    createdAt(date:Date){
        this.state.createdAt(date)
        return this
    }
    updatedAt(date:Date) {
        this.state.updatedAt(date)
        return this
    }
    build(): CheckoutInterface {
        return this.state.build()
    }


}