import DomainEvent from './DomainEvent';
export default class CheckoutCompleted extends DomainEvent {
    
    constructor(
        readonly checkoutUuid:string,
        readonly customerUuid:string,
        readonly state:string
    ) {
        super()
    }
}