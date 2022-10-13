import Money from "../ValueObjects/Money"
import ProductHeader from "../ValueObjects/ProductHeader"
import ProductID from "../ValueObjects/ProductID"
import ProductQuantity from "../ValueObjects/ProductQuantity"
import Builder from "./Builder"
import CheckoutItemInterface from '../Domain Models/Checkout/CheckoutItemInterface';
import CheckoutItemID from '../ValueObjects/CheckoutItemID';
import BaseCheckoutItemBuilderState from './States/BaseCheckoutItemBuilderState';
import CheckoutID from '../ValueObjects/CheckoutID';

export default class CheckoutItemBuilder implements Builder<CheckoutItemInterface>{
    public uuid: CheckoutItemID
    public _checkoutUuid: CheckoutID
    public productBasePrice: Money
    public productQuantity: ProductQuantity
    public productHeader: ProductHeader
    public productUuid: ProductID
    public createdAt: Date
    public updatedAt: Date
    private state: BaseCheckoutItemBuilderState
    
    private constructor(state:BaseCheckoutItemBuilderState){
        this.setState(state)
    }
    
    static initBuilder(state:BaseCheckoutItemBuilderState):CheckoutItemBuilder {
        return new CheckoutItemBuilder(state)
    }

    setState(state: BaseCheckoutItemBuilderState){
        this.state = state
        this.state.setContext(this)
    }
    checkoutUuid(checkoutUuid: () => CheckoutID):CheckoutItemBuilder {
        this.state.checkoutUuid(checkoutUuid)
        return this
    }
    checkoutItemUuid(itemUuid: () => CheckoutItemID):CheckoutItemBuilder {
        this.state.checkoutItemUuid(itemUuid)
        return this
    }
    checkoutProductHeader(itemHeader: () => ProductHeader): CheckoutItemBuilder {
        this.state.checkoutProductHeader(itemHeader)
        return this
    }
    checkoutProductBasePrice(itemBasePrice: () => Money): CheckoutItemBuilder {
        this.state.checkoutProductBasePrice(itemBasePrice)
        return this    
    }
    checkoutProductQuantity(itemQuantity: () => ProductQuantity): CheckoutItemBuilder {
        this.state.checkoutProductQuantity(itemQuantity)
        return this
    }
    checkoutProductUuid(productUuid:() => ProductID){
        this.state.checkoutProductUuid(productUuid)
        return this
    }
    checkoutCreatedAt(date:Date):CheckoutItemBuilder {
        this.state.checkoutCreatedAt(date)
        return this
    }
    checkoutUpdatedAt(date:Date): CheckoutItemBuilder {
        this.state.checkoutUpdatedAt(date)
        return this
    }
    build(): CheckoutItemInterface {
        return this.state.build()
    }

}