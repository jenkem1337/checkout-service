import CheckoutQueryModel from '../Model/CheckoutQueryModel';
import CheckoutItemQueryModel from '../Model/CheckoutItemQueryModel';

export default interface MutationalCheckoutReadRepository {
    save(checkout:CheckoutQueryModel):Promise<void>
    saveCheckoutItem(item: CheckoutItemQueryModel): Promise<void>
    updateByUuid(checkout:CheckoutQueryModel):Promise<void>
    updateStateByUuid(uuid:string, state:string):Promise<void>
    deleteCheckoutItemByUuid(uuid:string):Promise<void>
    updateSubTotalByUuid(uuid: string, subTotal:number): Promise<void>
    updateCheckoutItemQuantityByUuid(uuid:string, quantity:number): Promise<void>
}