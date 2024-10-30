import PaymentStrategy from './PeymentStrategy';
interface IBANDetail {
    no:string
}
export default class IBAN implements PaymentStrategy<IBANDetail>{
    private no:string
    
    setDetail(detail: IBANDetail) {
        if(!detail.no) {
            throw new Error("IBAN no is null or not setted !")
        }
        this.no = detail.no
    }
    getNo(){
        return this.no
    }
}