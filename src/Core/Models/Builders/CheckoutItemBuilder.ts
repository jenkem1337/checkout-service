import Money from "../ValueObjects/Money"
import ProductHeader from "../ValueObjects/ProductHeader"
import ProductID from "../ValueObjects/ProductID"
import ProductQuantity from "../ValueObjects/ProductQuantity"
import Builder from "./Builder"
import CheckoutItemInterface from '../Domain Models/CheckoutItemInterface';
import CheckoutItemID from '../ValueObjects/CheckoutItemID';
import BaseCheckoutItemBuilderState from './States/BaseCheckoutItemBuilderState';

export default class CheckoutItemBuilder implements Builder<CheckoutItemInterface>{
    public uuid: CheckoutItemID
    public itemBasePrice: Money
    public itemQuantity: ProductQuantity
    public itemHeader: ProductHeader
    public itemUuid: ProductID
    public createdAt: Date
    public updatedAt: Date
    public state: BaseCheckoutItemBuilderState
    
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
    checkoutUuid(uuid: () => CheckoutItemID):CheckoutItemBuilder {
        this.state.checkoutUuid(uuid)
        return this
    }
    checkoutItemUuid(itemUuid: () => ProductID):CheckoutItemBuilder {
        this.state.checkoutItemUuid(itemUuid)
        return this
    }
    checkoutItemHeader(itemHeader: () => ProductHeader): CheckoutItemBuilder {
        this.state.checkoutItemHeader(itemHeader)
        return this
    }
    checkoutItemBasePrice(itemBasePrice: () => Money): CheckoutItemBuilder {
        this.state.checkoutItemBasePrice(itemBasePrice)
        return this    
    }
    checkoutItemQuantity(itemQuantity: () => ProductQuantity): CheckoutItemBuilder {
        this.state.checkoutItemQuantity(itemQuantity)
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