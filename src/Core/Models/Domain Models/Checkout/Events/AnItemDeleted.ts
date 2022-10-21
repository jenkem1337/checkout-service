import { IEvent } from '@nestjs/cqrs';
import CheckoutItemID from 'src/Core/Models/ValueObjects/CheckoutItemID';
import CheckoutID from '../../../ValueObjects/CheckoutID';
export default class AnItemDeleted implements IEvent {
    
        public checkoutItemEntityUuid:CheckoutItemID
        public checkoutUuid: CheckoutID
        constructor (checkoutItemEntityUuid:CheckoutItemID, checkoutUuid: CheckoutID) {
            this.checkoutItemEntityUuid = checkoutItemEntityUuid
            this.checkoutUuid = checkoutUuid
        }
    
}