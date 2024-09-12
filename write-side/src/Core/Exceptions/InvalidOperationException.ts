import DomainException from "./DomainException";

export default abstract class InvalidOperationException extends DomainException {
    constructor(message:string){
        super(message)
    }
}