import ValueObject from '../ValueObject';
import NullPropertyException from '../../Exceptions/NullPropertyException';
import ChracterDoesntMatchException from '../../Exceptions/CharacterDoesntMatchException';

export const enum PeymentMethodEnum {
    CREDIT_CART = 'CREDIT_CART',
    REMOTE_PAY_SYSTEM = 'REMOTE_PAY_SYSTEM',
    IBAN = "IBAN"
}
export default class PeymentMethod extends ValueObject {
    private readonly peymentMethod: string
    private constructor(peymentMethod:string){
        super()
        this.peymentMethod = peymentMethod
    }
    static nullableConstruct(peymentMethod:string): PeymentMethod {
        return new PeymentMethod(peymentMethod??null)
    }


    static notNullableConstruct(peymentMethod:string){
        if(!peymentMethod) throw new NullPropertyException('peyment method')
        if(!peymentMethod.match('([a-zA-Z])')) throw new ChracterDoesntMatchException('peyment method')
        return new PeymentMethod(peymentMethod)

    }
    getPeymentMethod = () => this.peymentMethod
    equals(obj: Object): boolean {
        if(obj === this) return true
        if(obj === null || undefined) return false
        
        const that: PeymentMethod = <PeymentMethod> obj
        return this.peymentMethod === that.getPeymentMethod()
    }
}