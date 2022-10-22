import { IEvent } from '@nestjs/cqrs';
import Address from '../../../ValueObjects/Address';
import CheckoutID from '../../../ValueObjects/CheckoutID';
import CheckoutState from '../../../ValueObjects/CheckoutState';
import CustomerID from '../../../ValueObjects/CustomerID';
import Money from '../../../ValueObjects/Money';
import PeymentMethod from '../../../ValueObjects/PeymentMethod';
import CheckoutItemInterface from '../CheckoutItemInterface';
export default class CheckoutCreated implements IEvent{
    public checkoutUuid: CheckoutID
    public userUuid: CustomerID
    public address: Address
    public subTotal: Money
    public shippingPrice: Money
    public paymentMethod: PeymentMethod
    public checkoutState: CheckoutState
    public createdAt: Date
    public updatedAt:Date

    constructor(
        uuid: CheckoutID,
        userUuid: CustomerID,
        address: Address,
        subTotal: Money,
        shippingPrice: Money,
        paymentMethod: PeymentMethod,
        checkoutState:CheckoutState,
        createdAt: Date,
        updatedAt: Date,
        ){
            this.checkoutUuid = uuid
            this.userUuid = userUuid
            this.address  = address
            this.subTotal = subTotal
            this.shippingPrice = shippingPrice
            this.paymentMethod = paymentMethod
            this.checkoutState = checkoutState
            this.createdAt = createdAt
            this.updatedAt = updatedAt
        }

}