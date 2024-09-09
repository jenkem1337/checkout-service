import DomainException from './DomainException';
export default class CheckoutItemNotFoundException extends DomainException {
    constructor(){
        super('checkout item not found')
    }
}