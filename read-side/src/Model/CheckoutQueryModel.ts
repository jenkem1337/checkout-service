import CheckoutItemQueryModel from "./CheckoutItemQueryModel"
import QueryModel from "./QueryModel"
interface CheckoutQueryModelConstructerParameters {
    readonly uuid: string
     
    readonly customerUuid:string
 
    readonly subTotal:number
 
    readonly shippingPrice?:number
 
    readonly peymentMethod?:string
 
    readonly checkoutState:string
 
    readonly checkoutItemDocument?: Array<CheckoutItemQueryModel>
 
    readonly createdDate: Date
 
    readonly updatedDate:Date

}
export default class CheckoutQueryModel implements QueryModel{
    public readonly uuid: string
     
    public readonly customerUuid:string
 
    public readonly subTotal:number
 
    public readonly shippingPrice:number
 
    public readonly peymentMethod:string
 
    public readonly checkoutState:string
 
    public readonly checkoutItemDocument: Array<CheckoutItemQueryModel>
 
    public readonly createdDate: Date
 
    public readonly updatedDate:Date


    private constructor(prop: CheckoutQueryModelConstructerParameters) {
        this.uuid = prop.uuid
        this.customerUuid = prop.customerUuid
        this.subTotal = prop.subTotal
        this.shippingPrice = prop.shippingPrice ?? 0
        this.peymentMethod = prop.peymentMethod ?? null
        this.checkoutState = prop.checkoutState
        this.checkoutItemDocument = prop.checkoutItemDocument ?? []
        this.createdDate = prop.createdDate
        this.updatedDate = prop.updatedDate
    }
    isNull(): boolean {
        return false
    }

    static valueOf(prop:CheckoutQueryModelConstructerParameters){
        return new CheckoutQueryModel(prop)
    }
    
    
}   