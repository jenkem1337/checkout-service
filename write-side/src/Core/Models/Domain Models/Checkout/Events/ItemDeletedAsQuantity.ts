import { IEvent } from '@nestjs/cqrs';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import CheckoutItemID from '../../../ValueObjects/CheckoutItemID';
import ProductQuantity from '../../../ValueObjects/ProductQuantity';
import Money from 'src/Core/Models/ValueObjects/Money';
import DomainEvent from './DomainEvent';
export default class ItemDeletedAsQuantity extends DomainEvent {
    public checkoutItemUuid:CheckoutItemID
    public checkoutUuid: CheckoutID
    public quantity: ProductQuantity
    public subTotal: Money
    constructor (checkoutItemEntityUuid:CheckoutItemID, checkoutUuid: CheckoutID, subTotal:Money, quantity: ProductQuantity) {
        super()
        this.checkoutItemUuid = checkoutItemEntityUuid
        this.checkoutUuid = checkoutUuid
        this.subTotal = subTotal
        this.quantity = quantity
    }

}