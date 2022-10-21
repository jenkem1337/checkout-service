import { IEvent } from "@nestjs/cqrs";
import CheckoutID from "../../../ValueObjects/CheckoutID";
import CheckoutItemID from '../../../ValueObjects/CheckoutItemID';

export default class ItemDeleted implements IEvent {
    public checkoutItemEntityUuid:CheckoutItemID
    public checkoutUuid: CheckoutID
    constructor (checkoutItemEntityUuid:CheckoutItemID, checkoutUuid: CheckoutID) {
        this.checkoutItemEntityUuid = checkoutItemEntityUuid
        this.checkoutUuid = checkoutUuid
    }
}