import CheckoutQueryModel from "../Models/QueryModels/CheckoutQueryModel"
import QueryModel from "../Models/QueryModels/QueryModel"

export default interface  QueryableCheckoutReadRepository {
    findOneByUuid(_uuid: string): Promise<QueryModel>
    findOneByUuidAndCustomerUuid(uuid:string, customerUuid:string): Promise<QueryModel>
    findManyByCustomerUuid(custormerUuid:string): Promise<QueryModel[]>
    findOneWithoutItemsByUuid(custormerUuid:string): Promise<QueryModel>
}