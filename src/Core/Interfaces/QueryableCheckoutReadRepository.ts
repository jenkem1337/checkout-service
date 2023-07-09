import CheckoutQueryModel from "../Models/QueryModels/CheckoutQueryModel"

export default interface  QueryableCheckoutReadRepository {
    findOneByUuid(_uuid: string): Promise<CheckoutQueryModel>
    findOneByUuidAndCustomerUuid(uuid:string, customerUuid:string): Promise<CheckoutQueryModel>
    findManyByCustomerUuid(custormerUuid:string): Promise<CheckoutQueryModel[]>
}