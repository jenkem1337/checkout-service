import DomainException from "./DomainException";
import InvalidOperationException from "./InvalidOperationException";

export default class AllreadyExistException extends InvalidOperationException {
    constructor(whatIsExist:string){
        super(`${whatIsExist} is allready exist`)
    }
}