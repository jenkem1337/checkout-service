import { IEvent } from '@nestjs/cqrs';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import Money from '../../../ValueObjects/Money';
import DomainEvent from './DomainEvent';
export default class ShippingPriceAdded extends DomainEvent {
    constructor(
        public checkoutUuid:CheckoutID,
        public shippingPrice: Money
    ){super()}
}