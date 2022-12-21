import CheckoutAggregateMapperStrategy from './CheckoutAggregateStrategy';
import DoesntExistException from '../../../Core/Exceptions/DoesntExistExcepiton';

export default class CheckoutAggregateMapperContext {
    //private strategies: Map<string, CheckoutAggregateMapperStrategy<any>> = new Map<string, CheckoutAggregateMapperStrategy<any>>()
    private strategy: CheckoutAggregateMapperStrategy<any>
    setStrategy<M>(s: CheckoutAggregateMapperStrategy<M>) {
        this.strategy = s
    }
    getMapperStrategy(){
        return this.strategy
    }
}