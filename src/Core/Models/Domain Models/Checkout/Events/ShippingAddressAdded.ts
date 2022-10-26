import { IEvent } from '@nestjs/cqrs';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import Address from '../../../ValueObjects/Address';
export default class ShippingAddressAdded implements IEvent {
    constructor(
        public checkoutUuid:CheckoutID,
        public shippingAddress: Address
    ){}
}