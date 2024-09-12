import { IEvent } from '@nestjs/cqrs';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import CheckoutItemID from '../../../ValueObjects/CheckoutItemID';
import ProductQuantity from '../../../ValueObjects/ProductQuantity';
import Money from 'src/Core/Models/ValueObjects/Money';
import DomainEvent from './DomainEvent';
export default class ItemQuantityIncreased extends DomainEvent {
    public checkoutUuid: CheckoutID
    public checkoutItemUuid: CheckoutItemID
    public itemQuantity: ProductQuantity
    public subTotal: Money

    constructor(checkoutUuid: CheckoutID, checkoutItemUuid: CheckoutItemID, itemQuantity: ProductQuantity, subTotal:Money){
        super()    
        this.checkoutUuid = checkoutUuid
        this.checkoutItemUuid = checkoutItemUuid
        this.itemQuantity = itemQuantity
        this.subTotal = subTotal
    }
}