import Checkout from "../../Domain Models/Checkout/Checkout"
import CheckoutInterface from "../../Domain Models/Checkout/CheckoutInterface"
import NullCheckout from "../../Domain Models/Checkout/NullCheckout"
import CheckoutID from "../../ValueObjects/CheckoutID"
import CheckoutState from "../../ValueObjects/CheckoutState"
import CustomerID from "../../ValueObjects/CustomerID"
import Money from "../../ValueObjects/Money"
import { DomainModelFactory } from "../DomainModelFactory"
import CheckoutConstructorParamaters from "./CheckoutConstructorParameters"

export default class NullableCheckoutFactory implements DomainModelFactory<CheckoutInterface, CheckoutConstructorParamaters> {
    createInstance(constructerValues: CheckoutConstructorParamaters): CheckoutInterface {
        try {
            const checkoutUuid = new CheckoutID(constructerValues.checkoutUuid)
            const userUuid = new CustomerID(constructerValues.userUuid)
            const checkoutState = new CheckoutState(constructerValues.checkoutState)
            const checkoutSubTotal = new Money(constructerValues.subTotal)
    
            return Checkout.valueOfOnlyRequiredArguments(
                checkoutUuid,
                userUuid,
                checkoutSubTotal,
                checkoutState,
                constructerValues.createdAt,
                constructerValues.updatedAt
            )
        } catch (error) {
            return new NullCheckout()
        }
    }

}