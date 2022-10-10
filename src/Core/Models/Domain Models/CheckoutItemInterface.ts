import CheckoutItemID from '../ValueObjects/CheckoutItemID';
import EntityInterface from '../EntityInterface';
import ProductID from '../ValueObjects/ProductID';
import Money from '../ValueObjects/Money';
import ProductQuantity from '../ValueObjects/ProductQuantity';
import ProductHeader from '../ValueObjects/ProductHeader';
import CheckoutID from '../ValueObjects/CheckoutID';
export default interface CheckoutItemInterface extends EntityInterface<CheckoutItemID> {
    changeProductBasePrice(newBasePrice:number):void;
    incraseQuantity(quantity:number):void;
    decreaseQuantity(quantity:number):void
    getProductUuid():ProductID
    getProductBasePrice():Money
    getProductQuantity():ProductQuantity
    getProductHeader():ProductHeader
    getCheckoutUuid():CheckoutID
}