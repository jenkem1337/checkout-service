import AggregateRootEntity from "../../AggregateRootEntity";
import CheckoutID from "../../ValueObjects/CheckoutID";
import CustomerID from '../../ValueObjects/CustomerID';
import Address from '../../ValueObjects/Address';
import Money from '../../ValueObjects/Money';
import PeymentMethod from '../../ValueObjects/PeymentMethod';
import CheckoutItemInterface from './CheckoutItemInterface';
import CheckoutItemID from '../../ValueObjects/CheckoutItemID';
import CheckoutItemNotFoundException from '../../../Exceptions/CheckoutItemNotFoundException';
import ItemDeleted from "./Events/ItemDeleted";
import AnItemDeleted from "./Events/AnItemDeleted";
import ProductQuantity from '../../ValueObjects/ProductQuantity';
import CheckoutInterface, { CheckoutDetail } from './CheckoutInterface';
import ProductID from '../../ValueObjects/ProductID';
import CheckoutItemPricesUpdated from "./Events/CheckoutItemsPriceUpdated";
import ItemQuantityIncreased from './Events/ItemQuantityIncreased';
import NullObjectException from '../../../Exceptions/NullObjectException';
import ItemDeletedAsQuantity from './Events/ItemDeletedAsQuantity';
import CheckoutState, { CheckoutStates } from '../../ValueObjects/CheckoutState';
import CheckoutCancelled from './Events/CheckoutCancelled';
import CheckoutCompleted from './Events/CheckoutCompleted';
import CheckoutCreated from './Events/CheckoutCreated';
import ShippingAddressAdded from './Events/ShippingAddressAdded';
import PeymentMethodAdded from "./Events/PeymentMehodAdded";
import ShippingPriceAdded from "./Events/ShippingPriceAdded";
import { randomUUID } from "crypto";
import CheckoutAllreadyCancelledException from '../../../Exceptions/CheckoutAllreadyCancelledException';
import AnItemAdded from "./Events/AnItemAdded";
import CreditCart from "./PeymentContext/CreditCard";
import PaymentContext from "./PeymentContext/PeymentContext";
export default class Checkout extends AggregateRootEntity<CheckoutID> implements CheckoutInterface {
    private userUuid: CustomerID
    private address: Address
    private shippingPrice: Money
    private paymentMethod: PeymentMethod
    private checkoutState: CheckoutState
    private checkoutItems: Map<string, CheckoutItemInterface>

    constructor(
        uuid: CheckoutID,
        userUuid: CustomerID,
        checkoutState:CheckoutState,
        createdAt: Date,
        updatedAt: Date,
        checkoutItems?:Map<string, CheckoutItemInterface>,
        shippingAddress?: Address,
        paymentMethod?: PeymentMethod,
        shippingPrice?: Money,


        ){
            super(uuid, createdAt, updatedAt)
            this.userUuid = userUuid
            this.checkoutState = checkoutState
            this.checkoutItems = checkoutItems ?? new Map<string, CheckoutItemInterface>(),
            this.address = shippingAddress
            this.paymentMethod = paymentMethod
            this.shippingPrice = shippingPrice

        }

    static valueOfAllConstructorArguments(uuid: CheckoutID, userUuid: CustomerID, checkoutState:CheckoutState, createdAt: Date, updatedAt: Date, checkoutItems?:Map<string, CheckoutItemInterface>, shippingAddress?: Address, paymentMethod?: PeymentMethod, shippingPrice?: Money,){
        return new Checkout(uuid, userUuid,checkoutState,createdAt,updatedAt,checkoutItems, shippingAddress, paymentMethod, shippingPrice)
    }
    
    static valueOfOnlyRequiredArguments(uuid: CheckoutID, userUuid: CustomerID, checkoutState:CheckoutState, createdAt: Date, updatedAt: Date,){
        return new Checkout(uuid, userUuid, checkoutState, createdAt, updatedAt)
    }
    static createCheckout(customerUuid: CustomerID){
        const checkout = new Checkout(new CheckoutID(randomUUID()), customerUuid, new CheckoutState(CheckoutStates.CHECKOUT_CREATED), new Date, new Date)
        checkout.apply(new CheckoutCreated(
                checkout.getUuid(), 
                checkout.getUserUuid(), 
                checkout.getCheckoutState(),
                checkout.getCreatedAt(),
                checkout.getUpdatedAt()))
        return checkout
    }
    setShippingAddress(address: () => Address) {
        this.address = address()
        this.apply(new ShippingAddressAdded(this.getUuid(), this.address))
    }
    setPeymentMethod(peymentMethod: () => PeymentMethod){
        this.paymentMethod = peymentMethod()
        this.apply(new PeymentMethodAdded(this.getUuid(), this.paymentMethod))
    }
    setShippingPrice(shippingPrice: () => Money) {
        this.shippingPrice = shippingPrice()
        this.apply(new ShippingPriceAdded(this.getUuid(), this.shippingPrice))
    }
    addAnItem(item:CheckoutItemInterface): void{
        let itemDomainModel:CheckoutItemInterface = item
        if(this.isItemExistInList(item)) {
            itemDomainModel = this.checkoutItems.get(itemDomainModel.getUuid().getUuid()) 
            itemDomainModel.incraseQuantity(1)
            this.checkoutItems.set(itemDomainModel.getUuid().getUuid(), itemDomainModel)
            
            console.log(itemDomainModel.getProductQuantity().getQuantity())
            this.apply(new AnItemAdded(itemDomainModel))
            return;
        }
        this.checkoutItems.set(itemDomainModel.getUuid().getUuid(), itemDomainModel)
        
        this.apply(new AnItemAdded(itemDomainModel))
    }

    private isItemExistInList(item:CheckoutItemInterface): boolean {
        return this.checkoutItems.has(item.getUuid().getUuid()) === true
    }

    addItemOneMoreThan(itemUuid: CheckoutItemID,quantity:ProductQuantity){
        if(this.isNotItemExistInList(itemUuid)){
            throw new CheckoutItemNotFoundException()
        }
        if(quantity.getQuantity() === 1 ){
            this.addAnItem(this.checkoutItems.get(itemUuid.getUuid()))
            return;
        }
        const checkoutItemDomainModel = this.checkoutItems.get(itemUuid.getUuid())
        checkoutItemDomainModel.incraseQuantity(quantity.getQuantity()) 
        
        this.checkoutItems.set(itemUuid.getUuid(), checkoutItemDomainModel)
        
        this.apply(new ItemQuantityIncreased(this.getUuid(), itemUuid, checkoutItemDomainModel.getProductQuantity()))
    }

    takeOutAnItem(checkoutItemEntityUuid: CheckoutItemID) {
        if(this.isNotItemExistInList(checkoutItemEntityUuid)){
            throw new CheckoutItemNotFoundException()
        }

        if(this.isOneMoreThanItemExistInList(checkoutItemEntityUuid)) {
            const checkoutItem = this.checkoutItems.get(checkoutItemEntityUuid.getUuid())
            checkoutItem.decreaseQuantity(1)
            this.checkoutItems.set(checkoutItemEntityUuid.getUuid(), checkoutItem)
            
            this.apply(new AnItemDeleted(checkoutItemEntityUuid, this.getUuid(), checkoutItem.getProductQuantity()))
            return;
        }

        this.checkoutItems.delete(checkoutItemEntityUuid.getUuid())
        
        this.apply(new ItemDeleted(checkoutItemEntityUuid, this.getUuid()))
    }

    takeOutOneMoreThanItem(itemUuid: CheckoutItemID, itemQuantity: ProductQuantity){
        if(this.isNotItemExistInList(itemUuid)){
            throw new CheckoutItemNotFoundException()
        }
        let checkoutItemDomainModel = this.checkoutItems.get(itemUuid.getUuid())
        checkoutItemDomainModel.decreaseQuantity(itemQuantity.getQuantity())
        
        if(this.isCheckoutItemQuantityEqualToZero(checkoutItemDomainModel)){
            this.checkoutItems.delete(itemUuid.getUuid())
            
            this.apply(new ItemDeleted(itemUuid, this.getUuid()))
            return;
        }
        this.checkoutItems.set(itemUuid.getUuid(), checkoutItemDomainModel)
        
        this.apply(new ItemDeletedAsQuantity(itemUuid, this.getUuid(), checkoutItemDomainModel.getProductQuantity()))
    }

    takeOutSameItems(itemUuid:CheckoutItemID){
        if(this.isNotItemExistInList(itemUuid)){
            throw new CheckoutItemNotFoundException()
        }
        this.checkoutItems.delete(itemUuid.getUuid())
        
        this.apply(new ItemDeleted(itemUuid, this.getUuid()))
    }

    private isCheckoutItemQuantityEqualToZero(checkoutItem:CheckoutItemInterface) {
        return checkoutItem.getProductQuantity().getQuantity() === 0
    }

    private isNotItemExistInList(checkoutItemEntityUuid: CheckoutItemID){
        return this.checkoutItems.has(checkoutItemEntityUuid.getUuid()) === false
    }

    private isOneMoreThanItemExistInList(checkoutItemEntityUuid: CheckoutItemID){
        const checkoutItem = this.checkoutItems.get(checkoutItemEntityUuid.getUuid())
        const checkoutItemQuantity = checkoutItem.getProductQuantity()
        return checkoutItemQuantity.getQuantity() > 1
    }

    cancelThisCheckout(){
        this.checkoutState = new CheckoutState(CheckoutStates.CHECKOUT_CANCELLED)
        this.apply(new CheckoutCancelled(this.getUuid()))
    }

    completeThisCheckout(detail:CheckoutDetail){
        this.checkoutState = new CheckoutState(CheckoutStates.CHECKOUT_COMPLETED)
        this.address = Address.notNullableConstruct(
            detail.addressName,
            detail.addressOwnerName, 
            detail.addressOwnerSurname, 
            detail.fullAddressInformation, 
            detail.addressCountry,
            detail.addressProvince, 
            detail.addressDistrict, 
            detail.addressZipCode
        )

        const paymentContext = new PaymentContext()
        const paymentStrategy = paymentContext.getPaymentStrategy(detail.paymentMethod, detail.paymentDetail)
        
        this.apply(new CheckoutCompleted(
                this.getUuid().getUuid(),
                this.getUserUuid().getUuid(),
                detail.paymentMethod,
                paymentStrategy,
                this.address,
            )
        )
    }

    isCheckoutCancelled(){
        if(this.checkoutState.getState() === CheckoutStates.CHECKOUT_CANCELLED){
            throw new CheckoutAllreadyCancelledException()
        }
    }

    getUserUuid = () => this.userUuid
    getAddress  = () => this.address
    getPeymentMethod = () => this.paymentMethod
    getShippingPrice = () => this.shippingPrice
    getCheckoutState = () => this.checkoutState
    getCheckoutItems = ():Map<string, CheckoutItemInterface> => this.checkoutItems
}
