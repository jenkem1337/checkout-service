import Entity from '../Entity';
import CheckoutItemID from '../ValueObjects/CheckoutItemID';
import Money from '../ValueObjects/Money';
import ProductQuantity from '../ValueObjects/ProductQuantity';
import ProductHeader from '../ValueObjects/ProductHeader';
import ProductID from '../ValueObjects/ProductID';
import CheckoutItemInterface from './CheckoutItemInterface';
export default class CheckoutItem extends Entity<CheckoutItemID> implements CheckoutItemInterface{
    private itemBasePrice: Money
    private itemQuantity: ProductQuantity
    private itemHeader: ProductHeader
    private itemUuid: ProductID

    constructor(
        uuid:CheckoutItemID, 
        productUuid: ProductID,
        productHeader:ProductHeader, 
        productBasePrice:Money,
        productQuantity:ProductQuantity,
        createdAt:Date,
        updatedAt:Date){
            super(uuid, createdAt, updatedAt)
            this.itemUuid = productUuid
            this.itemHeader = productHeader
            this.itemBasePrice = productBasePrice
            this.itemQuantity = productQuantity
    }   
    changeItemBasePrice(newBasePrice:number){
        this.itemBasePrice = new Money(newBasePrice);
    }
    incraseQuantity(quantity: number): void {
        this.itemQuantity = this.itemQuantity.incrementQuantity(quantity)
    }
    decreaseQuantity(quantity: number): void {
        this.itemQuantity = this.itemQuantity.decrementQuantity(quantity)
    }
    getItemUuid      = (): ProductID       => this.itemUuid
    getItemHeader    = (): ProductHeader   => this.itemHeader
    getItemBasePrice = (): Money           => this.itemBasePrice
    getItemQuantity  = (): ProductQuantity => this.itemQuantity
}