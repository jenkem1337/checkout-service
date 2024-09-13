import { IEvent } from "@nestjs/cqrs";
import CheckoutID from "../../../ValueObjects/CheckoutID";
import CheckoutItemID from '../../../ValueObjects/CheckoutItemID';
import Money from "src/Core/Models/ValueObjects/Money";
import DomainEvent from "./DomainEvent";

export default class ItemDeleted extends DomainEvent {
    public checkoutItemUuid:CheckoutItemID
    public checkoutUuid: CheckoutID
    constructor (checkoutItemEntityUuid:CheckoutItemID, checkoutUuid: CheckoutID) {
        super()
        this.checkoutItemUuid = checkoutItemEntityUuid
        this.checkoutUuid = checkoutUuid
       
    }
}