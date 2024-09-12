import DomainException from './DomainException';
import NotFoundBaseException from './NotFoundBaseException';
export default class CheckoutItemNotFoundException extends NotFoundBaseException {
    constructor(){
        super('checkout item not found')
    }
}