import QueryModel from '../Model/QueryModel';

export default interface  QueryableCheckoutReadRepository {
    findOneByUuid(_uuid: string): Promise<QueryModel>
    findOneByUuidAndCustomerUuid(uuid:string, customerUuid:string): Promise<QueryModel>
    findOneWithoutItemsByUuid(custormerUuid:string): Promise<QueryModel>
    findOneCheckoutItemByUuid(uuid:string):Promise<QueryModel>
}