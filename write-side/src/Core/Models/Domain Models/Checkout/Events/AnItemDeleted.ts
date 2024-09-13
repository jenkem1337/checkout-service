import { IEvent } from '@nestjs/cqrs';
import CheckoutItemID from 'src/Core/Models/ValueObjects/CheckoutItemID';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import Money from 'src/Core/Models/ValueObjects/Money';
import ProductQuantity from 'src/Core/Models/ValueObjects/ProductQuantity';
import DomainEvent from './DomainEvent';
export default class AnItemDeleted extends DomainEvent {
    
        public checkoutItemUuid:CheckoutItemID
        public checkoutUuid: CheckoutID
        public quantity: ProductQuantity
        constructor (checkoutItemEntityUuid:CheckoutItemID, checkoutUuid: CheckoutID, quantity:ProductQuantity) {
            super()
            this.checkoutItemUuid = checkoutItemEntityUuid
            this.checkoutUuid = checkoutUuid
            this.quantity = quantity
        }
    
}