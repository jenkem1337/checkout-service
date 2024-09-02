import CheckoutItemInterface from "../../Domain Models/Checkout/CheckoutItemInterface";
import CheckoutID from "../../ValueObjects/CheckoutID";
import CheckoutItemID from "../../ValueObjects/CheckoutItemID";
import Money from "../../ValueObjects/Money";
import ProductID from "../../ValueObjects/ProductID";
import ProductQuantity from "../../ValueObjects/ProductQuantity";
import { DomainModelFactory } from "../DomainModelFactory";
import CheckoutItemConstructorParameters from "./CheckoutItemConstructorParameters";
import CheckoutItem from "../../Domain Models/Checkout/CheckoutItem";
import ProductHeader from "../../ValueObjects/ProductHeader";

export default class ConcreateCheckoutItemFactory implements DomainModelFactory<CheckoutItemInterface, CheckoutItemConstructorParameters>{
    createInstance(constructerValues: CheckoutItemConstructorParameters): CheckoutItemInterface {
        const checkoutItemUuid = new CheckoutItemID(constructerValues.checkoutItemUuid)
        const checkoutUuid    = new CheckoutID(constructerValues.checkoutUuid)
        const productUuid    = new ProductID(constructerValues.productUuid)
        const basePrice     = new Money(constructerValues.productBasePrice)
        const quantity     = new ProductQuantity(constructerValues.productQuantity)
        const productHeader = new ProductHeader(constructerValues.productHeader)

        return new CheckoutItem(checkoutItemUuid, checkoutUuid, productUuid, productHeader, basePrice, quantity, constructerValues.createdAt, constructerValues.updatedAt)
    }
}