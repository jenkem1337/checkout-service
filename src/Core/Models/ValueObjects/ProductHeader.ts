import ValueObject from '../ValueObject';
import NullPropertyException from '../../Exceptions/NullPropertyException';
import ChracterDoesntMatchException from '../../Exceptions/CharacterDoesntMatchException';

export default class ProductHeader extends ValueObject {
    private readonly header:string
    constructor(productHeader: string){
        super()
        if(!productHeader) throw new NullPropertyException('product header');
        if(!productHeader.match('([a-zA-Z])')){
            throw new ChracterDoesntMatchException('product header');
        }
        this.header = productHeader;        
    }
    getHeader = () => this.header

    equals(obj: Object): boolean {
        if(obj === this) return true
        if(obj === null || undefined) return false

        let that: ProductHeader = <ProductHeader> obj;
        return this.header === that.getHeader()
    }
}