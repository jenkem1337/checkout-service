import DomainException from "./DomainException";
import InvalidOperationException from "./InvalidOperationException";

export default class NullIdException extends InvalidOperationException {
    constructor(){
        super('Id must not be null')
    }
}