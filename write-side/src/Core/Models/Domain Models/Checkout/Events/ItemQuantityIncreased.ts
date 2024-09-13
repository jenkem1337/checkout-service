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

    constructor(checkoutUuid: CheckoutID, checkoutItemUuid: CheckoutItemID, itemQuantity: ProductQuantity){
        super()    
        this.checkoutUuid = checkoutUuid
        this.checkoutItemUuid = checkoutItemUuid
        this.itemQuantity = itemQuantity
    }
}