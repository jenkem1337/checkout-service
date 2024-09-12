import DomainException from "./DomainException";
import NotFoundBaseException from "./NotFoundBaseException";

export default class CheckoutNotFound extends NotFoundBaseException {
    constructor(){
        super("Checkout Not Found")
    }
}