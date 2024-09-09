import DomainException from "./DomainException";

export default class ProductNotFound extends DomainException {
    constructor(productUuid:string){
        super(`There is no product in database with ${productUuid} id, please try again`)
    }
}