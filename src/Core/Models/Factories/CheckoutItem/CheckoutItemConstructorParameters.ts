export default interface CheckoutItemConstructorParameters {
    checkoutItemUuid:string
    checkoutUuid:string
    productUuid:string
    productHeader:string
    productBasePrice:number
    productQuantity:number
    createdAt:Date
    updatedAt:Date
}