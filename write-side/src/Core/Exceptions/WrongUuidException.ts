import DomainException from "./DomainException";
import InvalidOperationException from "./InvalidOperationException";

export default class WrongUuidException extends InvalidOperationException {
    constructor(){
        super('Wrong uuid');
    }
}