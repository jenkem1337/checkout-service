import PaymentStrategy from './PeymentStrategy';
export default class PaymentContext {
    private paymentStrategies: Map<string, PaymentStrategy>
    constructor(paymentStrategies: Map<string, PaymentStrategy>){
        this.paymentStrategies = paymentStrategies
    }
}