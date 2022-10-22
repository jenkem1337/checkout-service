import { IEvent } from '@nestjs/cqrs';
import CheckoutID from '../../../ValueObjects/CheckoutID';
export default class CheckoutCompleted implements IEvent {
    public checkoutUuid: CheckoutID
    constructor(uuid:CheckoutID) {
        this.checkoutUuid = this.checkoutUuid
    }
}