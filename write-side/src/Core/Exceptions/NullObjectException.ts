import DomainException from './DomainException';
export default class NullObjectException extends DomainException {
    constructor(){
        super('You can not access null object methods')
    }
}