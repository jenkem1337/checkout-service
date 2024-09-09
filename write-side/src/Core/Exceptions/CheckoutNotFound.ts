import DomainException from "./DomainException";

export default class CheckoutNotFound extends DomainException {
    constructor(){
        super("Checkout Not Found")
    }
}