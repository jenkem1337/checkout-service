import DomainException from './DomainException';
export default class NullPropertyException extends DomainException {
    constructor(property:string){
        super(`${property} must not be null`);
    }
}