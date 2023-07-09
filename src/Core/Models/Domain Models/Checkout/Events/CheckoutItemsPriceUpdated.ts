import { IEvent } from "@nestjs/cqrs";
import ProductID from '../../../ValueObjects/ProductID';
import Money from '../../../ValueObjects/Money';

export default class CheckoutItemPricesUpdated implements IEvent {
    public readonly checkoutItemUuid :ProductID
    public readonly itemPrice: Money
    constructor(checkoutItemUuid:ProductID, itemPrice: Money){
        this.checkoutItemUuid= checkoutItemUuid
        this.itemPrice = itemPrice
    }
}