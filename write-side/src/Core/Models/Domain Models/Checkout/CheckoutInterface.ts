import EntityInterface from '../../../Interfaces/EntityInterface';
import CheckoutID from '../../ValueObjects/CheckoutID';
import CheckoutItemInterface from './CheckoutItemInterface';
import CheckoutItemID from '../../ValueObjects/CheckoutItemID';
import CustomerID from '../../ValueObjects/CustomerID';
import ProductQuantity from '../../ValueObjects/ProductQuantity';
import CheckoutState from '../../ValueObjects/CheckoutState';


export default interface CheckoutInterface extends EntityInterface<CheckoutID>{
    
    addAnItem(item: CheckoutItemInterface):void
    addItemOneMoreThan(itemUuid: CheckoutItemID,itemQuantity:ProductQuantity):void
    takeOutAnItem(uuid:CheckoutItemID):void
    takeOutOneMoreThanItem(itemUuid:CheckoutItemID, itemQuantity:ProductQuantity):void
    takeOutSameItems(itemUuid:CheckoutItemID):void

    
    cancelThisCheckout():void
    completeThisCheckout():void
   
    getUserUuid():CustomerID
    getCheckoutState(): CheckoutState
    getCheckoutItems(): Map<string, CheckoutItemInterface>
}