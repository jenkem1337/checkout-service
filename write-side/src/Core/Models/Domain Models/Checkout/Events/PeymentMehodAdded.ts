import { IEvent } from '@nestjs/cqrs';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import PeymentMethod from '../../../ValueObjects/PeymentMethod';
export default class PeymentMethodAdded implements IEvent {
    constructor(
        public checkoutUuid:CheckoutID,
        public peymentMethod:PeymentMethod
    ){}
}