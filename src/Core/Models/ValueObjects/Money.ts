import NegativeNumberException from '../../Exceptions/NegativeNumberException';
import ValueObject from '../ValueObject';
export default class Money extends ValueObject {
    private readonly amount: number
    
    constructor(amount:number){
        super()
        if(amount<0) throw new NegativeNumberException();
        this.amount = amount
    }
    times(number:number):Money{
        number = Math.abs(number)

        return new Money(this.amount * number)
    }
    plus(number:number){
        number = Math.abs(number)
        return new Money(this.amount + number)
    }
    subtract(number:number):Money {
        number = Math.abs(number)
        return new Money(this.amount - number)
    }
    getAmount = () => this.amount

    equals(obj: Object): boolean {
        if(obj === this) return true
        if(obj === null || undefined) return false

        const that = <Money> obj;

        return this.amount === that.getAmount()
    }
}