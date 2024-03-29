import { IEvent } from "@nestjs/cqrs";
import CheckoutID from "../../../ValueObjects/CheckoutID";
import Money from "../../../ValueObjects/Money";
import ProductHeader from "../../../ValueObjects/ProductHeader";
import ProductID from "../../../ValueObjects/ProductID";
import ProductQuantity from "../../../ValueObjects/ProductQuantity";
import CheckoutItemInterface from '../CheckoutItemInterface';
import CheckoutItemID from '../../../ValueObjects/CheckoutItemID';

export default class AnItemAdded implements IEvent {
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