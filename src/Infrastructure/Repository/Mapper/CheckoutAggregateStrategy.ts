import CheckoutAggregateMapper from './WriteCheckoutAggregateMapper';
import Checkout from '../../../Core/Models/Domain Models/Checkout/Checkout';
import CheckoutInterface from '../../../Core/Models/Domain Models/Checkout/CheckoutInterface';
export default interface CheckoutAggregateMapperStrategy<M> {
    fromAggregateToDataMapper(checkoutDomainModel: Checkout): M
    fromDataMapperToAggregate(_checkoutDataMapper: M): CheckoutInterface
    fromDataMapperArrayToAggrageteArray(_checkoutDataMapper: M[]):CheckoutInterface[]
}