import ValueObject from '../ValueObject';
import NegativeNumberException from '../../Exceptions/NegativeNumberException';
export default class ProductQuantity extends ValueObject {
    private readonly quantity: number
    constructor (quantity:number){
        super() 
        if(quantity < 0) {
            this.quantity = 0
            return;
        }
        this.quantity = quantity
    }

    incrementQuantity(quantityValue:number){
        return new ProductQuantity(this.quantity + Math.abs(quantityValue))
    }

    decrementQuantity(quantityValue: number) {
        return new ProductQuantity(this.quantity - Math.abs(quantityValue));
    }
    getQuantity = () => this.quantity

    equals(obj: Object): boolean {
        if(obj === this) return true
        if(obj === null || undefined) return false

        const that: ProductQuantity = <ProductQuantity> obj

        return this.quantity === that.getQuantity()
    }
}