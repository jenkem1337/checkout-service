import { IEvent } from '@nestjs/cqrs';
import CheckoutItemID from 'src/Core/Models/ValueObjects/CheckoutItemID';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import Money from 'src/Core/Models/ValueObjects/Money';
import ProductQuantity from 'src/Core/Models/ValueObjects/ProductQuantity';
export default class AnItemDeleted implements IEvent {
    
        public checkoutItemUuid:CheckoutItemID
        public checkoutUuid: CheckoutID
        public subTotal: Money
        public quantity: ProductQuantity
        constructor (checkoutItemEntityUuid:CheckoutItemID, checkoutUuid: CheckoutID, subTotal:Money, quantity:ProductQuantity) {
            this.checkoutItemUuid = checkoutItemEntityUuid
            this.checkoutUuid = checkoutUuid
            this.subTotal = subTotal
            this.quantity = quantity
        }
    
}