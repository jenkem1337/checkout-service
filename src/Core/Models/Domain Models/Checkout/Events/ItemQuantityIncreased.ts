import { IEvent } from '@nestjs/cqrs';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import CheckoutItemID from '../../../ValueObjects/CheckoutItemID';
import ProductQuantity from '../../../ValueObjects/ProductQuantity';
export default class ItemQuantityIncreased implements IEvent {
    public checkoutUuid: CheckoutID
    public checkoutItemUuid: CheckoutItemID
    public itemQuantity: ProductQuantity

    constructor(checkoutUuid: CheckoutID, checkoutItemUuid: CheckoutItemID, itemQuantity: ProductQuantity){
            this.checkoutUuid = checkoutUuid
            this.checkoutItemUuid = checkoutItemUuid
            this.itemQuantity = itemQuantity
        }
}