import { IEvent } from "@nestjs/cqrs";
import ProductID from '../../../ValueObjects/ProductID';
import Money from '../../../ValueObjects/Money';
import DomainEvent from "./DomainEvent";

export default class CheckoutItemPricesUpdated extends DomainEvent {
    public readonly checkoutItemUuid :ProductID
    public readonly itemPrice: Money
    constructor(checkoutItemUuid:ProductID, itemPrice: Money){
        super()
        this.checkoutItemUuid= checkoutItemUuid
        this.itemPrice = itemPrice
    }
}