import { IEvent } from "@nestjs/cqrs";
import ProductID from '../../../ValueObjects/ProductID';
import CheckoutID from '../../../ValueObjects/CheckoutID';

export default class CheckoutItemPricesUpdated implements IEvent {
    public checkoutItemUuid :ProductID
    constructor(checkoutItemUuid:ProductID){
        this.checkoutItemUuid= checkoutItemUuid
    }
}