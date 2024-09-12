import DomainException from './DomainException';
import InvalidOperationException from './InvalidOperationException';
export default class NullPropertyException extends InvalidOperationException {
    constructor(property:string){
        super(`${property} must not be null`);
    }
}