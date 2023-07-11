import QueryModel from "./QueryModel"

interface CheckoutItemQueryModelConstructorParameters {
    readonly uuid:string
    readonly checkoutUuid:string
    readonly productBasePrice:number
    readonly productQuantity: number
    readonly productHeader:string
    readonly productUuid: string    
    readonly createdDate: Date
    readonly updatedDate: Date

}

export default class CheckoutItemQueryModel implements QueryModel{
    public readonly uuid:string
    public readonly checkoutUuid:string
    public readonly productBasePrice:number
    public readonly productQuantity: number
    public readonly productHeader:string
    public readonly productUuid: string    
    public readonly createdDate: Date
    public readonly updatedDate: Date
    private constructor(prop: CheckoutItemQueryModelConstructorParameters){
        this.uuid = prop.uuid
        this.checkoutUuid = prop.checkoutUuid
        this.productBasePrice = prop.productBasePrice
        this.productHeader = prop.productHeader
        this.productQuantity = prop.productQuantity
        this.productUuid = prop.productUuid
        this.createdDate = prop.createdDate
        this.updatedDate = prop.updatedDate
    }
    isNull(): boolean {
        return false
    }

    static valueOf(prop: CheckoutItemQueryModelConstructorParameters){
        return new CheckoutItemQueryModel(prop)
    }

}