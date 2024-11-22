import CheckoutID from '../../../ValueObjects/CheckoutID';
import CheckoutState from '../../../ValueObjects/CheckoutState';
import CustomerID from '../../../ValueObjects/CustomerID';
import DomainEvent from './DomainEvent';
export default class CheckoutCreated extends DomainEvent{
    public checkoutUuid: CheckoutID
    public userUuid: CustomerID
    public checkoutState: CheckoutState
    public createdAt: Date
    public updatedAt:Date

    constructor(
        uuid: CheckoutID,
        userUuid: CustomerID,
        
        checkoutState:CheckoutState,
        createdAt: Date,
        updatedAt: Date,
        ){
            super()
            this.checkoutUuid = uuid
            this.userUuid = userUuid
            
            this.checkoutState = checkoutState
            this.createdAt = createdAt
            this.updatedAt = updatedAt
        }

}