import { IEvent } from "@nestjs/cqrs";

interface CheckoutCreatedAndItemAddedOneMoreThanEventProps {
    readonly checkoutUuid:string
    readonly customerUuid:string
    readonly checkoutItemUuid: string
    readonly productUuid: string
    readonly checkoutState:string
    readonly productHeader: string
    readonly productBasePrice: number
    readonly checkoutSubTotal: number
    readonly checkoutCreatedDate: Date
    readonly checkoutUpdatedDate: Date
    readonly itemCreatedDate: Date
    readonly itemUpdatedDate: Date
    readonly quantity:number

}
export default class CheckoutCreatedAndItemAddedOneMoreThanEvent implements IEvent {
    public readonly checkoutUuid:string
    public readonly customerUuid:string
    public readonly checkoutItemUuid: string
    public readonly productUuid: string
    public readonly checkoutState:string
    public readonly productHeader: string
    public readonly productBasePrice: number
    public readonly checkoutSubTotal: number
    public readonly checkoutCreatedDate: Date
    public readonly checkoutUpdatedDate: Date
    public readonly itemCreatedDate: Date
    public readonly itemUpdatedDate: Date
    public readonly quantity:number

    constructor(prop: CheckoutCreatedAndItemAddedOneMoreThanEventProps){
        this.checkoutUuid = prop.checkoutUuid
        this.customerUuid = prop.customerUuid
        this.checkoutItemUuid = prop.checkoutItemUuid
        this.productUuid = prop.productUuid
        this.checkoutState = prop.checkoutState
        this.productHeader = prop.productHeader
        this.productBasePrice = prop.productBasePrice
        this.checkoutSubTotal = prop.checkoutSubTotal
        this.checkoutCreatedDate = prop.checkoutCreatedDate
        this.checkoutUpdatedDate = prop.checkoutUpdatedDate
        this.itemCreatedDate = prop.itemCreatedDate
        this.itemUpdatedDate = prop.itemUpdatedDate
        this.quantity = prop.quantity
    }
} 