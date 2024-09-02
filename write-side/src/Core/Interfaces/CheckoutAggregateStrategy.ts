import CheckoutAggregateMapper from '../../Infrastructure/Repository/Mapper/WriteCheckoutAggregateMapper';
import Checkout from '../Models/Domain Models/Checkout/Checkout';
import CheckoutInterface from '../Models/Domain Models/Checkout/CheckoutInterface';
export default interface CheckoutAggregateMapperStrategy<M> {
    fromAggregateToDataMapper(checkoutDomainModel: Checkout): M
    fromDataMapperToAggregate(_checkoutDataMapper: M): CheckoutInterface
    fromDataMapperArrayToAggrageteArray(_checkoutDataMapper: M[]):CheckoutInterface[]
}