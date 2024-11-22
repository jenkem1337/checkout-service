import Checkout from "../../Domain Models/Checkout/Checkout"
import CheckoutInterface from "../../Domain Models/Checkout/CheckoutInterface"
import CheckoutID from "../../ValueObjects/CheckoutID"
import CheckoutState from "../../ValueObjects/CheckoutState"
import CustomerID from "../../ValueObjects/CustomerID"
import { DomainModelFactory } from "../DomainModelFactory"
import CheckoutConstructorParamaters from "./CheckoutConstructorParameters"

export default class ConcreateAllArgumentCheckoutFactory implements DomainModelFactory<CheckoutInterface, CheckoutConstructorParamaters> {
    createInstance(constructerValues: CheckoutConstructorParamaters): CheckoutInterface {
            const checkoutUuid  = new CheckoutID(constructerValues.checkoutUuid)
            const userUuid      = new CustomerID(constructerValues.userUuid)
            const checkoutState = new CheckoutState(constructerValues.checkoutState)
            
            return Checkout.valueOfAllConstructorArguments(
                checkoutUuid,
                userUuid,
                checkoutState,
                constructerValues.createdAt,
                constructerValues.updatedAt,
                constructerValues.checkoutItems,
            )
    }

}