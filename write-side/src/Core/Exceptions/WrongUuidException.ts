import DomainException from "./DomainException";

export default class WrongUuidException extends DomainException {
    constructor(){
        super('Wrong uuid');
    }
}