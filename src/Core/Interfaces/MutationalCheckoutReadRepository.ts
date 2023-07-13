import CheckoutItemQueryModel from "../Models/QueryModels/CheckoutItemQueryModel"
import CheckoutQueryModel from "../Models/QueryModels/CheckoutQueryModel"

export default interface MutationalCheckoutReadRepository {
    save(checkout:CheckoutQueryModel):Promise<void>
    saveCheckoutItem(item: CheckoutItemQueryModel): Promise<void>
    updateByUuid(checkout:CheckoutQueryModel):Promise<void>
    updateStateByUuid(uuid:string, state:string):Promise<void>
    deleteCheckoutItemByUuid(uuid:string):Promise<void>
}