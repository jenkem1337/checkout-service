import AggregateRootEntity from "../../AggregateRootEntity";
import CheckoutID from "../../ValueObjects/CheckoutID";
import CustomerID from '../../ValueObjects/CustomerID';
import Address from '../../ValueObjects/Address';
import Money from '../../ValueObjects/Money';
import PeymentMethod from '../../ValueObjects/PeymentMethod';
import CheckoutItemInterface from './CheckoutItemInterface';
import ItemAdded from "./Events/ItemAdded";
import CheckoutItemID from '../../ValueObjects/CheckoutItemID';
import CheckoutItemNotFoundException from '../../../Exceptions/CheckoutItemNotFoundException';
import ItemDeleted from "./Events/ItemDeleted";
import AnItemDeleted from "./Events/AnItemDeleted";

export default class Checkout extends AggregateRootEntity<CheckoutID> {
    private userUuid: CustomerID
    private address: Address
    private subTotal: Money
    private shippingPrice: Money
    private paymentMethod: PeymentMethod
    private checkoutItems: Map<string, CheckoutItemInterface>

    constructor(
        uuid: CheckoutID,
        userUuid: CustomerID,
        address: Address,
        subTotal: Money,
        shippingPrice: Money,
        paymentMethod: PeymentMethod,
        createdAt: Date,
        updatedAt: Date
        ){
            super(uuid, createdAt, updatedAt)
            this.userUuid = userUuid
            this.address  = address
            this.subTotal = subTotal
            this.shippingPrice = shippingPrice
            this.paymentMethod = paymentMethod
            this.checkoutItems = new Map<string, CheckoutItemInterface>()
        }
    addAnItem(item:CheckoutItemInterface): void{
        this.increaseItemQuantityIfExist(item)
        this.checkoutItems.set(item.getUuid().getUuid(), item)
        this.apply(new ItemAdded(item))
    }
    private increaseItemQuantityIfExist(item:CheckoutItemInterface): void {
        if( this.checkoutItems.has(item.getUuid().getUuid()) ) {
            const itemDomainModel:CheckoutItemInterface = this.checkoutItems.get(item.getUuid().getUuid()) 
            itemDomainModel.incraseQuantity(1)
            this.checkoutItems.set(item.getUuid().getUuid(), itemDomainModel)
            this.apply(new ItemAdded(item))
            return;
        }
    }
    takeOutAnItemFromList(checkoutItemEntityUuid: CheckoutItemID) {
        if(this.isNotItemExistInList(checkoutItemEntityUuid)){
            throw new CheckoutItemNotFoundException()
        }
        if(this.isOneMoreThanItemExistInList(checkoutItemEntityUuid)) {
            const checkoutItem = this.checkoutItems.get(checkoutItemEntityUuid.getUuid())
            checkoutItem.decreaseQuantity(1)
            this.checkoutItems.set(checkoutItemEntityUuid.getUuid(), checkoutItem)
            this.apply(new AnItemDeleted(checkoutItemEntityUuid))
            return;
        }
        this.checkoutItems.delete(checkoutItemEntityUuid.getUuid())
        this.apply(new ItemDeleted(checkoutItemEntityUuid))
    }
    private isNotItemExistInList(checkoutItemEntityUuid: CheckoutItemID){
        return this.checkoutItems.has(checkoutItemEntityUuid.getUuid()) === false
    }
    private isOneMoreThanItemExistInList(checkoutItemEntityUuid: CheckoutItemID){
        const checkoutItem = this.checkoutItems.get(checkoutItemEntityUuid.getUuid())
        const checkoutItemQuantity = checkoutItem.getProductQuantity()
        return checkoutItemQuantity.getQuantity() > 1
    }
    getCheckoutItems = ():Map<string, CheckoutItemInterface> => this.checkoutItems
    getCheckoutItemsSize = ():number => this.checkoutItems.size
}
