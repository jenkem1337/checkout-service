import DomainException from './DomainException';
import InvalidOperationException from './InvalidOperationException';
export default class NullObjectException extends InvalidOperationException {
    constructor(){
        super('You can not access null object methods')
    }
}