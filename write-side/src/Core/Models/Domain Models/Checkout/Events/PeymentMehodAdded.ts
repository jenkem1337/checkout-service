import { IEvent } from '@nestjs/cqrs';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import PeymentMethod from '../../../ValueObjects/PeymentMethod';
import DomainEvent from './DomainEvent';
export default class PeymentMethodAdded extends DomainEvent {
    constructor(
        public checkoutUuid:CheckoutID,
        public peymentMethod:PeymentMethod
    ){super()}
}