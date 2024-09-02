import Checkout from "../../Domain Models/Checkout/Checkout";
import CheckoutInterface from "../../Domain Models/Checkout/CheckoutInterface";
import CustomerID from "../../ValueObjects/CustomerID";
import { DomainModelFactory } from "../DomainModelFactory";
import CheckoutConstructorParamaters from "./CheckoutConstructorParameters";

export default class CreateCheckoutWithCheckoutCreatedEventFactory implements DomainModelFactory<CheckoutInterface, CheckoutConstructorParamaters> {
    createInstance(constructerValues: CheckoutConstructorParamaters): CheckoutInterface {
        const customerUUID = new CustomerID(constructerValues.userUuid)
        return Checkout.createCheckout(customerUUID)
    }

}