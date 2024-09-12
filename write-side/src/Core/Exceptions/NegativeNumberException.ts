import DomainException from './DomainException';
import InvalidOperationException from './InvalidOperationException';
export default class NegativeNumberException extends InvalidOperationException {
    constructor(){
        super('number must be greater than zero')
    }
}