import DomainException from './DomainException';
export default class ChracterDoesntMatchException extends DomainException {
    constructor(property:string){
        super(`${property} does not match`)
    }
}