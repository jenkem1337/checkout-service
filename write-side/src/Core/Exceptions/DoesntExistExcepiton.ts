import DomainException from './DomainException';
import NotFoundBaseException from './NotFoundBaseException';
export default class DoesntExistException extends NotFoundBaseException {
    constructor(prop:string){
        super(prop + ' ' + 'doesnt exist')
    }
}