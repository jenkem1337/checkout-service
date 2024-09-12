import { IEvent } from '@nestjs/cqrs';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import Address from '../../../ValueObjects/Address';
import DomainEvent from './DomainEvent';
export default class ShippingAddressAdded extends DomainEvent {
    constructor(
        public checkoutUuid:CheckoutID,
        public shippingAddress: Address
    ){super()}
}