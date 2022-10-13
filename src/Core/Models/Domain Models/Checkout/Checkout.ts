import AggregateRootEntity from "../../AggregateRootEntity";
import CheckoutID from "../../ValueObjects/CheckoutID";
import CustomerID from '../../ValueObjects/CustomerID';
import Address from '../../ValueObjects/Address';
import Money from '../../ValueObjects/Money';
import PeymentMethod from '../../ValueObjects/PeymentMethod';
import CheckoutItemInterface from './CheckoutItemInterface';
import ItemAdded from "./Events/ItemAdded";
import PaymentContext from './PeymentContext/PeymentContext';
import PaymentStrategy from './PeymentContext/PeymentStrategy';
import CreditCart from './PeymentContext/CreditCard';
import RemotePaySystem from './PeymentContext/RemotePaySystem';
import IBAN from './PeymentContext/IBAN';
import CheckoutItemID from '../../ValueObjects/CheckoutItemID';
import CheckoutItemNotFoundException from '../../../Exceptions/CheckoutItemNotFoundException';
import ItemDeleted from "./Events/ItemDeleted";

export default class Checkout extends AggregateRootEntity<CheckoutID> {
    private userUuid: CustomerID
    private address: Address
    private subTotal: Money
    private shippingPrice: Money
    private paymentMethod: PeymentMethod
    private paymentContext: PaymentContext
    private checkoutItems: Map<string, CheckoutItemInterface>

    constructor(
        uuid: CheckoutID,
        userUuid: CustomerID,
        address: Address,
        subTotal: Money,
        paymentMethod: PeymentMethod,
        createdAt: Date,
        updatedAt: Date
        ){
            super(uuid, createdAt, updatedAt)
            this.userUuid = userUuid
            this.address  = address
            this.subTotal = subTotal
            this.paymentMethod = paymentMethod
            this.checkoutItems = new Map<string, CheckoutItemInterface>()
            this.paymentContext = new PaymentContext(new Map<string, PaymentStrategy>(
                [
                    ['CREDIT_CART', new CreditCart()],
                    ['REMOTE_PAY_SYSTEM', new RemotePaySystem()],
                    ['IBAN', new IBAN()]
                ]
            ))
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
    removeAnItem(checkoutItemEntityUuid: CheckoutItemID) {
        if(!this.checkoutItems.has(checkoutItemEntityUuid.getUuid())){
            throw new CheckoutItemNotFoundException()
        } 
        this.checkoutItems.delete(checkoutItemEntityUuid.getUuid())
        this.apply(new ItemDeleted(checkoutItemEntityUuid))
    }
    getCheckoutItems = ():Map<string, CheckoutItemInterface> => this.checkoutItems
    getCheckoutItemsSize = ():number => this.checkoutItems.size
}
