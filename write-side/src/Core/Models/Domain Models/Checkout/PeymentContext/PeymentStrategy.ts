export default interface PaymentStrategy<T extends object>{
    setDetail(detail: T):void
}