import { IEvent } from '@nestjs/cqrs';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import CheckoutItemID from '../../../ValueObjects/CheckoutItemID';
import ProductQuantity from '../../../ValueObjects/ProductQuantity';
export default class ItemDeletedAsQuantity implements IEvent {
    public checkoutItemEntityUuid:CheckoutItemID
    public checkoutUuid: CheckoutID
    public quantity: ProductQuantity
    constructor (checkoutItemEntityUuid:CheckoutItemID, checkoutUuid: CheckoutID, quantity: ProductQuantity) {
        this.checkoutItemEntityUuid = checkoutItemEntityUuid
        this.checkoutUuid = checkoutUuid
        this.quantity = quantity
    }

}