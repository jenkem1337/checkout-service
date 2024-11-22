import CheckoutItemQueryModel from "./CheckoutItemQueryModel"
import QueryModel from "./QueryModel"
interface CheckoutQueryModelConstructerParameters {
    readonly uuid: string
     
    readonly customerUuid:string
 
    readonly subTotal?:number
  
    readonly checkoutState:string
 
    readonly checkoutItemDocument?: Array<CheckoutItemQueryModel> | Array<object>
 
    readonly createdDate: Date
 
    readonly updatedDate:Date

}
export default class CheckoutQueryModel implements QueryModel{
    public readonly uuid: string
     
    public readonly customerUuid:string
 
    public readonly subTotal:number
 
    public readonly checkoutState:string
 
    public readonly checkoutItemDocument: Array<CheckoutItemQueryModel> | Array<object>
 
    public readonly createdDate: Date
 
    public readonly updatedDate:Date


    private constructor(prop: CheckoutQueryModelConstructerParameters) {
        this.uuid = prop.uuid
        this.customerUuid = prop.customerUuid
        this.subTotal = prop.subTotal ?? null
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