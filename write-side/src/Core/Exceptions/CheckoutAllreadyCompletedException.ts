import DomainException from "./DomainException";

export default class CheckoutAllreadyCompletedException extends DomainException {
    constructor(){
        super("This checkout allready completed you can not change anything")
    }
}