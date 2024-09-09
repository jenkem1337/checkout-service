import Entity from '../../Entity';
import CheckoutItemID from '../../ValueObjects/CheckoutItemID';
import Money from '../../ValueObjects/Money';
import ProductQuantity from '../../ValueObjects/ProductQuantity';
import ProductHeader from '../../ValueObjects/ProductHeader';
import ProductID from '../../ValueObjects/ProductID';
import CheckoutItemInterface from './CheckoutItemInterface';
import CheckoutID from '../../ValueObjects/CheckoutID';
export default class CheckoutItem extends Entity<CheckoutItemID> implements CheckoutItemInterface{
    private productBasePrice: Money
    private productQuantity: ProductQuantity
    private productHeader: ProductHeader
    private checkoutUuid: CheckoutID
    private productUuid: ProductID

    constructor(
        uuid:CheckoutItemID, 
        checkoutUuid: CheckoutID,
        productUuid: ProductID,
        productHeader:ProductHeader, 
        productBasePrice:Money,
        productQuantity:ProductQuantity,
        createdAt:Date,
        updatedAt:Date){
            super(uuid, createdAt, updatedAt)
            this.checkoutUuid = checkoutUuid
            this.productUuid = productUuid
            this.productHeader = productHeader
            this.productBasePrice = productBasePrice
            this.productQuantity = productQuantity
    }   
    changeProductBasePrice(newBasePrice:number){
        this.productBasePrice = new Money(newBasePrice);
    }
    incraseQuantity(quantity: number): void {
        this.productQuantity = this.productQuantity.incrementQuantity(quantity)
    }
    decreaseQuantity(quantity: number): void {
        this.productQuantity = this.productQuantity.decrementQuantity(quantity)
    }
    getProductUuid      = (): ProductID       => this.productUuid
    getCheckoutUuid     = (): CheckoutID      => this.checkoutUuid
    getProductHeader    = (): ProductHeader   => this.productHeader
    getProductBasePrice = (): Money           => this.productBasePrice
    getProductQuantity  = (): ProductQuantity => this.productQuantity
}