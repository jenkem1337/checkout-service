import DeleteAnItemDto from 'src/Application/Controller/DTOs/DeleteAnItemDto';
import PaymentStrategy from './PeymentStrategy';
interface CreditCartDetail {
    number:string,
    expirationDate:string,
    cvc:string,
    owner:string
}
export default class CreditCart implements PaymentStrategy<CreditCartDetail>{
    private number:string
    private expirationDate:string
    private cvc:string
    private owner:string
    
    setDetail(detail: CreditCartDetail) {
        if(!detail.number) throw new Error("Cart number is null or not setted")
        if(!detail.expirationDate) throw new Error("Cart expiration date is null or not setted")
        if(!detail.cvc) throw new Error("Cart cvc number is null or not setted")
        if(!detail.owner) throw new Error("Cart owner is null or not setted")
        
        this.number = detail.number
        this.expirationDate = detail.expirationDate
        this.cvc = detail.cvc
        this.owner = detail.owner
    }
    getNumber = () => this.number
    getExpirationDate = () => this.expirationDate
    getCVC = () => this.cvc
    getOwner = () => this.owner
}