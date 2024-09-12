import DomainException from "./DomainException";
import InvalidOperationException from "./InvalidOperationException";

export default class CheckoutAllreadyCancelledException extends InvalidOperationException {
    constructor(){
        super(`This checkout allready cancelled`)
    }
}