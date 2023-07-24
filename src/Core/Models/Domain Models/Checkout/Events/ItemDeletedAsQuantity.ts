import { IEvent } from '@nestjs/cqrs';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import CheckoutItemID from '../../../ValueObjects/CheckoutItemID';
import ProductQuantity from '../../../ValueObjects/ProductQuantity';
import Money from 'src/Core/Models/ValueObjects/Money';
export default class ItemDeletedAsQuantity implements IEvent {
    public checkoutItemUuid:CheckoutItemID
    public checkoutUuid: CheckoutID
    public quantity: ProductQuantity
    public subTotal: Money
    constructor (checkoutItemEntityUuid:CheckoutItemID, checkoutUuid: CheckoutID, subTotal:Money, quantity: ProductQuantity) {
        this.checkoutItemUuid = checkoutItemEntityUuid
        this.checkoutUuid = checkoutUuid
        this.subTotal = subTotal
        this.quantity = quantity
    }

}