import { IEvent } from '@nestjs/cqrs';
import CheckoutID from '../../../ValueObjects/CheckoutID';
export default class CheckoutCancelled implements IEvent {
    public checkoutUuid:CheckoutID

    constructor(uuid:CheckoutID) {
        this.checkoutUuid = uuid
    }
}