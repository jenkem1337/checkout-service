import DomainException from "./DomainException";

export default class CheckoutAllreadyCancelledException extends DomainException {
    constructor(){
        super(`This checkout allready cancelled`)
    }
}