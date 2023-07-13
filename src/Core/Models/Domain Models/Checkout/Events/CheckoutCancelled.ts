import { IEvent } from '@nestjs/cqrs';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import { CheckoutStates } from 'src/Core/Models/ValueObjects/CheckoutState';
export default class CheckoutCancelled implements IEvent {
    public readonly checkoutUuid:CheckoutID
    public readonly newCheckoutState: string
    constructor(uuid:CheckoutID) {
        this.checkoutUuid = uuid
        this.newCheckoutState = CheckoutStates.CHECKOUT_CANCELLED
    }
}