import { IEvent } from "@nestjs/cqrs";
import CheckoutItemID from '../../../ValueObjects/CheckoutItemID';

export default class ItemDeleted implements IEvent {
    public checkoutItemEntityUuid:CheckoutItemID
    constructor (checkoutItemEntityUuid:CheckoutItemID) {
        this.checkoutItemEntityUuid = checkoutItemEntityUuid
    }
}