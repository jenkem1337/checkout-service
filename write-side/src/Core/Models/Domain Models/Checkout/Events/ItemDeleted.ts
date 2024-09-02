import { IEvent } from "@nestjs/cqrs";
import CheckoutID from "../../../ValueObjects/CheckoutID";
import CheckoutItemID from '../../../ValueObjects/CheckoutItemID';
import Money from "src/Core/Models/ValueObjects/Money";

export default class ItemDeleted implements IEvent {
    public checkoutItemUuid:CheckoutItemID
    public checkoutUuid: CheckoutID
    public subTotal:Money
    constructor (checkoutItemEntityUuid:CheckoutItemID, checkoutUuid: CheckoutID, subTotal:Money) {
        this.checkoutItemUuid = checkoutItemEntityUuid
        this.checkoutUuid = checkoutUuid
        this.subTotal = subTotal
    }
}