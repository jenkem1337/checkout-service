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
import ProductQuantity from '../../ValueObjects/ProductQuantity';
import CheckoutInterface from './CheckoutInterface';

export default class Checkout extends AggregateRootEntity<CheckoutID> implements CheckoutInterface {
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
        if(this.increaseItemQuantityIfExist(item)) {
            const itemDomainModel:CheckoutItemInterface = this.checkoutItems.get(item.getUuid().getUuid()) 
            itemDomainModel.incraseQuantity(1)
            this.checkoutItems.set(item.getUuid().getUuid(), itemDomainModel)
            this.calculateSubTotal()
            this.apply(new ItemAdded(item))
            return;
        }
        this.checkoutItems.set(item.getUuid().getUuid(), item)
        this.calculateSubTotal()
        this.apply(new ItemAdded(item))
    }
    private increaseItemQuantityIfExist(item:CheckoutItemInterface): boolean {
        return this.checkoutItems.has(item.getUuid().getUuid()) === true
    }

    takeOutAnItem(checkoutItemEntityUuid: CheckoutItemID) {
        if(this.isNotItemExistInList(checkoutItemEntityUuid)){
            throw new CheckoutItemNotFoundException()
        }

        if(this.isOneMoreThanItemExistInList(checkoutItemEntityUuid)) {
            const checkoutItem = this.checkoutItems.get(checkoutItemEntityUuid.getUuid())
            checkoutItem.decreaseQuantity(1)
            this.checkoutItems.set(checkoutItemEntityUuid.getUuid(), checkoutItem)
            this.calculateSubTotal()
            this.apply(new AnItemDeleted(checkoutItemEntityUuid, this.getUuid()))
            return;
        }

        this.checkoutItems.delete(checkoutItemEntityUuid.getUuid())
        this.calculateSubTotal()
        this.apply(new ItemDeleted(checkoutItemEntityUuid, this.getUuid()))
    }
    private isNotItemExistInList(checkoutItemEntityUuid: CheckoutItemID){
        return this.checkoutItems.has(checkoutItemEntityUuid.getUuid()) === false
    }
    private isOneMoreThanItemExistInList(checkoutItemEntityUuid: CheckoutItemID){
        const checkoutItem = this.checkoutItems.get(checkoutItemEntityUuid.getUuid())
        const checkoutItemQuantity = checkoutItem.getProductQuantity()
        return checkoutItemQuantity.getQuantity() > 1
    }

    calculateSubTotal(){
        this.subTotal = new Money(0)
        if(this.checkoutItems.size === 0) return;
        this.checkoutItems.forEach((item:CheckoutItemInterface, uuid:string) => {

            let itemQuantity: ProductQuantity = item.getProductQuantity()
            let itemPrice: Money = item.getProductBasePrice()
            let totalPrice: Money = itemPrice.times(itemQuantity.getQuantity())
            
            this.subTotal = this.subTotal.plus(totalPrice.getAmount())
        })
        if(this.isSubTotalPriceNotEqualOrMoreThan100()) {
            this.subTotal = this.subTotal.plus(this.shippingPrice.getAmount())
        }
        
    }
    private isSubTotalPriceNotEqualOrMoreThan100():boolean{
        return (this.subTotal.getAmount() >= 100) === false
    }
    getSubTotal = () => this.subTotal
    getUserUuid = () => this.userUuid
    getAddress  = () => this.address
    getPeymentMethod = () => this.paymentMethod
    getCheckoutItems = ():Map<string, CheckoutItemInterface> => this.checkoutItems
}
