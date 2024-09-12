import { IEvent } from '@nestjs/cqrs';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import DomainEvent from './DomainEvent';
export default class CheckoutCompleted extends DomainEvent {
    public checkoutUuid: CheckoutID
    constructor(uuid:CheckoutID) {
        super()
        this.checkoutUuid = this.checkoutUuid
    }
}