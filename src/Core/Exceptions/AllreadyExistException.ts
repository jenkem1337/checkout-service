import DomainException from "./DomainException";

export default class AllreadyExistException extends DomainException {
    constructor(whatIsExist:string){
        super(`${whatIsExist} is allready exist`)
    }
}