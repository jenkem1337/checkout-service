import { IEvent } from '@nestjs/cqrs';
import CheckoutItemID from 'src/Core/Models/ValueObjects/CheckoutItemID';
export default class AnItemDeleted implements IEvent {
    
        public checkoutItemEntityUuid:CheckoutItemID
        constructor (checkoutItemEntityUuid:CheckoutItemID) {
            this.checkoutItemEntityUuid = checkoutItemEntityUuid
        }
    
}