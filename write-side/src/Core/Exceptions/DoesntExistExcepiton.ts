import DomainException from './DomainException';
export default class DoesntExistException extends DomainException {
    constructor(prop:string){
        super(prop + ' ' + 'doesnt exist')
    }
}