import { IEvent } from '@nestjs/cqrs';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import { CheckoutStates } from 'src/Core/Models/ValueObjects/CheckoutState';
import DomainEvent from './DomainEvent';
export default class CheckoutCancelled extends DomainEvent {
    public readonly checkoutUuid:CheckoutID
    public readonly newCheckoutState: string
    constructor(uuid:CheckoutID) {
        super()
        this.checkoutUuid = uuid
        this.newCheckoutState = CheckoutStates.CHECKOUT_CANCELLED
    }
}