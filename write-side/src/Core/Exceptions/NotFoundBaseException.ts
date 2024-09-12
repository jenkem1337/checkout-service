import DomainException from "./DomainException";

export default abstract class NotFoundBaseException extends DomainException {
    constructor(message:string){
        super(message)
    }
}