import ValueObject from '../ValueObject';
import NullPropertyException from '../../Exceptions/NullPropertyException';
import ChracterDoesntMatchException from '../../Exceptions/CharacterDoesntMatchException';

export default class PeymentMethod extends ValueObject {
    private readonly peymentMethod: string
    constructor(peymentMethod:string){
        super()
        if(!peymentMethod) throw new NullPropertyException('peyment method')
        if(!peymentMethod.match('([a-zA-Z])')) throw new ChracterDoesntMatchException('peyment method')
        this.peymentMethod = peymentMethod
    }
    
    getPeymentMethod = () => this.peymentMethod
    equals(obj: Object): boolean {
        if(obj === this) return true
        if(obj === null || undefined) return false
        
        const that: PeymentMethod = <PeymentMethod> obj
        return this.peymentMethod === that.getPeymentMethod()
    }
}