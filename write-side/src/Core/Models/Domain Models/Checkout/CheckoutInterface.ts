import EntityInterface from '../../../Interfaces/EntityInterface';
import CheckoutID from '../../ValueObjects/CheckoutID';
import CheckoutItemInterface from './CheckoutItemInterface';
import CheckoutItemID from '../../ValueObjects/CheckoutItemID';
import Money from '../../ValueObjects/Money';
import CustomerID from '../../ValueObjects/CustomerID';
import Address from '../../ValueObjects/Address';
import PeymentMethod from '../../ValueObjects/PeymentMethod';
import ProductQuantity from '../../ValueObjects/ProductQuantity';
import ProductID from '../../ValueObjects/ProductID';
import CheckoutState from '../../ValueObjects/CheckoutState';
export default interface CheckoutInterface extends EntityInterface<CheckoutID>{
    setShippingAddress(address:() => Address):void
    setPeymentMethod(peymentMethod: () => PeymentMethod):void
    setShippingPrice(shippingPrice: () => Money):void
    addAnItem(item: CheckoutItemInterface):void
    addItemOneMoreThan(itemUuid: CheckoutItemID,itemQuantity:ProductQuantity):void
    takeOutAnItem(uuid:CheckoutItemID):void
    takeOutOneMoreThanItem(itemUuid:CheckoutItemID, itemQuantity:ProductQuantity):void
    takeOutSameItems(itemUuid:CheckoutItemID):void

    
    cancelThisCheckout():void
    completeThisCheckout():void
    isCheckoutCancelled():void
   
    getUserUuid():CustomerID
    getAddress():Address
    getShippingPrice():Money
    getPeymentMethod():PeymentMethod
    getCheckoutState(): CheckoutState
    getCheckoutItems(): Map<string, CheckoutItemInterface>
}