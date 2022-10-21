import EntityInterface from '../../EntityInterface';
import CheckoutID from '../../ValueObjects/CheckoutID';
import CheckoutItemInterface from './CheckoutItemInterface';
import CheckoutItemID from '../../ValueObjects/CheckoutItemID';
import Money from '../../ValueObjects/Money';
import CustomerID from '../../ValueObjects/CustomerID';
import Address from '../../ValueObjects/Address';
import PeymentMethod from '../../ValueObjects/PeymentMethod';
export default interface CheckoutInterface extends EntityInterface<CheckoutID>{
    addAnItem(item: CheckoutItemInterface):void
    takeOutAnItem(uuid:CheckoutItemID):void
    calculateSubTotal():void
    getSubTotal():Money
    getUserUuid():CustomerID
    getAddress():Address
    getPeymentMethod():PeymentMethod
    getCheckoutItems(): Map<string, CheckoutItemInterface>
}