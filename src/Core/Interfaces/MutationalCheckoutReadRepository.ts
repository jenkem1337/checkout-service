import CheckoutQueryModel from "../Models/QueryModels/CheckoutQueryModel"

export default interface MutationalCheckoutReadRepository {
    save(checkout:CheckoutQueryModel):Promise<void>
    updateByUuid(checkout:CheckoutQueryModel):Promise<void>
    deleteByUuid(uuid:string):Promise<void>
}