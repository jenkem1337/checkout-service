import Checkout from "../../Domain Models/Checkout/Checkout"
import CheckoutInterface from "../../Domain Models/Checkout/CheckoutInterface"
import NullCheckout from "../../Domain Models/Checkout/NullCheckout"
import Address from "../../ValueObjects/Address"
import CheckoutID from "../../ValueObjects/CheckoutID"
import CheckoutState from "../../ValueObjects/CheckoutState"
import CustomerID from "../../ValueObjects/CustomerID"
import Money from "../../ValueObjects/Money"
import PeymentMethod from "../../ValueObjects/PeymentMethod"
import { DomainModelFactory } from "../DomainModelFactory"
import CheckoutConstructorParamaters from "./CheckoutConstructorParameters"

export default class NullableAllArgumentCheckoutFactory implements DomainModelFactory<CheckoutInterface, CheckoutConstructorParamaters> {
    createInstance(constructerValues: CheckoutConstructorParamaters): CheckoutInterface {
        try {
            const checkoutUuid = new CheckoutID(constructerValues.checkoutUuid)
            const userUuid = new CustomerID(constructerValues.userUuid)
            const checkoutState = new CheckoutState(constructerValues.checkoutState)
            const checkoutSubTotal = new Money(constructerValues.subTotal)
            const checkoutShippingPrice = new Money(constructerValues.shippingPrice)
            const checkoutAddress = Address.nullableConstruct(constructerValues.addressName, constructerValues.addressOwnerName, constructerValues.addressOwnerSurname, constructerValues.fullAddressInformation, constructerValues.addressCountry, constructerValues.addressProvince, constructerValues.addressDistrict, constructerValues.addressZipCode)
            const checkoutPeymentMethod = PeymentMethod.nullableConstruct(constructerValues.peymentMethod)
            return Checkout.valueOfAllConstructorArguments(
                checkoutUuid,
                userUuid,
                checkoutSubTotal,
                checkoutState,
                constructerValues.createdAt,
                constructerValues.updatedAt,
                constructerValues.checkoutItems,
                checkoutAddress,
                checkoutPeymentMethod,
                checkoutShippingPrice
            )
        } catch (error) {
            return new NullCheckout()
        }
    }

}