import EntityInterface from '../../EntityInterface';
import CheckoutID from '../../ValueObjects/CheckoutID';
import CheckoutItemInterface from './CheckoutItemInterface';
import CheckoutItemID from '../../ValueObjects/CheckoutItemID';
import Money from '../../ValueObjects/Money';
import CustomerID from '../../ValueObjects/CustomerID';
import Address from '../../ValueObjects/Address';
import PeymentMethod from '../../ValueObjects/PeymentMethod';
import ProductQuantity from '../../ValueObjects/ProductQuantity';
import ProductID from '../../ValueObjects/ProductID';
export default interface CheckoutInterface extends EntityInterface<CheckoutID>{
    addAnItem(item: CheckoutItemInterface):void
    addItemOneMoreThan(itemUuid: CheckoutItemID,itemQuantity:ProductQuantity):void
    takeOutAnItem(uuid:CheckoutItemID):void
    takeOutOneMoreThanItem(itemUuid:CheckoutItemID, itemQuantity:ProductQuantity):void
    updateItemPrices(itemUuid: ProductID,newPrices: Money):void
    calculateSubTotal():void
    getSubTotal():Money
    getUserUuid():CustomerID
    getAddress():Address
    getPeymentMethod():PeymentMethod
    getCheckoutItems(): Map<string, CheckoutItemInterface>
}