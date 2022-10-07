import DomainException from "./DomainException";

export default class NullIdException extends DomainException {
    constructor(){
        super('Id must not be null')
    }
}