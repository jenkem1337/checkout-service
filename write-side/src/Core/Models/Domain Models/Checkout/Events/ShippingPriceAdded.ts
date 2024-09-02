import { IEvent } from '@nestjs/cqrs';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import Money from '../../../ValueObjects/Money';
export default class ShippingPriceAdded implements IEvent {
    constructor(
        public checkoutUuid:CheckoutID,
        public shippingPrice: Money
    ){}
}