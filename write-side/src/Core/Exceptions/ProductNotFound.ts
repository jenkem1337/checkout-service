import DomainException from "./DomainException";
import NotFoundBaseException from "./NotFoundBaseException";

export default class ProductNotFound extends NotFoundBaseException {
    constructor(productUuid:string){
        super(`There is no product in database with ${productUuid} id, please try again`)
    }
}