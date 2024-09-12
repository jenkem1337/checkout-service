import DomainException from './DomainException';
import InvalidOperationException from './InvalidOperationException';
export default class ChracterDoesntMatchException extends InvalidOperationException {
    constructor(property:string){
        super(`${property} does not match`)
    }
}