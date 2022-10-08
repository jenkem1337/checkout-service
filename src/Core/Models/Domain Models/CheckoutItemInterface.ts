import CheckoutItemID from '../ValueObjects/CheckoutItemID';
import EntityInterface from '../EntityInterface';
import ProductID from '../ValueObjects/ProductID';
import Money from '../ValueObjects/Money';
import ProductQuantity from '../ValueObjects/ProductQuantity';
import ProductHeader from '../ValueObjects/ProductHeader';
export default interface CheckoutItemInterface extends EntityInterface<CheckoutItemID> {
    changeItemBasePrice(newBasePrice:number):void;
    incraseQuantity(quantity:number):void;
    decreaseQuantity(quantity:number):void
    getItemUuid():ProductID
    getItemBasePrice():Money
    getItemQuantity():ProductQuantity
    getItemHeader():ProductHeader
}