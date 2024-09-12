import { IEvent } from "@nestjs/cqrs";
import CheckoutID from "../../../ValueObjects/CheckoutID";
import Money from "../../../ValueObjects/Money";
import ProductHeader from "../../../ValueObjects/ProductHeader";
import ProductID from "../../../ValueObjects/ProductID";
import ProductQuantity from "../../../ValueObjects/ProductQuantity";
import CheckoutItemInterface from '../CheckoutItemInterface';
import CheckoutItemID from '../../../ValueObjects/CheckoutItemID';
import DomainEvent from "./DomainEvent";

export default class AnItemAdded extends DomainEvent {
    public itemEntityUuid: CheckoutItemID
    public productBasePrice: Money
    public productQuantity: ProductQuantity
    public productHeader: ProductHeader
    public checkoutUuid: CheckoutID
    public productUuid: ProductID
    public subTotal: Money
    public createdAt: Date
    public updatedAt: Date

    constructor(item: CheckoutItemInterface, subTotal:Money) {
        super()
        this.checkoutUuid = item.getCheckoutUuid()
        this.productBasePrice = item.getProductBasePrice()
        this.itemEntityUuid = item.getUuid()
        this.productQuantity = item.getProductQuantity()
        this.productUuid = item.getProductUuid()
        this.productHeader = item.getProductHeader()
        this.subTotal = subTotal
        this.createdAt = item.getCreatedAt()
        this.updatedAt = item.getUpdatedAt()
    }
}