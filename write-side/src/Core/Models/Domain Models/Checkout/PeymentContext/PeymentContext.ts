import CreditCart from './CreditCard';
import IBAN from './IBAN';
import PaymentStrategy from './PeymentStrategy';
export default class PaymentContext {
    private paymentStrategies: Map<string, PaymentStrategy<object>>
    constructor(){
        this.paymentStrategies = new Map()
        this.paymentStrategies.set("IBAN", new IBAN)
        this.paymentStrategies.set("CreditCart", new CreditCart)

    }

    getPaymentStrategy(paymentMethod:string, paymentDetail:object):PaymentStrategy<object> {
        if(!this.paymentStrategies.has(paymentMethod)) {
            throw new Error("Unknown payment method !")
        }

        const strategy = this.paymentStrategies.get(paymentMethod)
        strategy.setDetail(paymentDetail)
        return strategy
    }
}