import ValueObject from '../ValueObject';
import NullPropertyException from '../../Exceptions/NullPropertyException';

export enum CheckoutStates {
    CHECKOUT_COMPLETED = "CHECKOUT_COMPLETED",
    CHECKOUT_CREATED = "CHECKOUT_CREATED",
    CHECKOUT_CANCELLED = "CHECKOUT_CANCELLED"
}

export default class CheckoutState extends ValueObject {
    private state: string
    constructor(state:string){
        super()
        if(!state){
            throw new NullPropertyException('state')
        }
        this.state = state
    }
    getState = () => this.state
    equals(obj: Object): boolean {
        if(obj === this) return true
        if(obj === null || undefined) return false
        
        const that = <CheckoutState> obj
        
        return this.state === that.getState()
    }
}