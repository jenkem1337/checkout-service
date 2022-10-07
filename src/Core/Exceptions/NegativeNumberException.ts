import DomainException from './DomainException';
export default class NegativeNumberException extends DomainException {
    constructor(){
        super('number must be greater than zero')
    }
}