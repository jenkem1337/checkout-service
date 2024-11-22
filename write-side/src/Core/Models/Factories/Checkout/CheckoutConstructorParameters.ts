import CheckoutItemInterface from "../../Domain Models/Checkout/CheckoutItemInterface"

export default interface CheckoutConstructorParamaters {
    checkoutUuid?:string
    userUuid?:string
    checkoutState?:string
    checkoutItems?: Map<string, CheckoutItemInterface>
    createdAt?:Date
    updatedAt?:Date

}
