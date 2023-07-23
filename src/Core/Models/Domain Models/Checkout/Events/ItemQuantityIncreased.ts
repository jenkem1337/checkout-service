import { IEvent } from '@nestjs/cqrs';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import CheckoutItemID from '../../../ValueObjects/CheckoutItemID';
import ProductQuantity from '../../../ValueObjects/ProductQuantity';
import Money from 'src/Core/Models/ValueObjects/Money';
export default class ItemQuantityIncreased implements IEvent {
    public checkoutUuid: CheckoutID
    public checkoutItemUuid: CheckoutItemID
    public itemQuantity: ProductQuantity
    public subTotal: Money

    constructor(checkoutUuid: CheckoutID, checkoutItemUuid: CheckoutItemID, itemQuantity: ProductQuantity, subTotal:Money){
            this.checkoutUuid = checkoutUuid
            this.checkoutItemUuid = checkoutItemUuid
            this.itemQuantity = itemQuantity
            this.subTotal = subTotal
        }
}