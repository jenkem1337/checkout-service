import DomainEvent from './DomainEvent';
import Address from 'src/Core/Models/ValueObjects/Address';
import CreditCart from '../PeymentContext/CreditCard';
import IBAN from '../PeymentContext/IBAN';
import PaymentStrategy from '../PeymentContext/PeymentStrategy';
export default class CheckoutCompleted extends DomainEvent {
    
    constructor(
        readonly checkoutUuid:string,
        readonly customerUuid:string,
        readonly peymentMethod:string,
        readonly peymentDetail: PaymentStrategy<object>,
        readonly orderAddress:Address,
    ) {
        super()
    }
}