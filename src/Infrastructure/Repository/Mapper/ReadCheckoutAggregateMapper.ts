import CheckoutAggregateMapperStrategy from './CheckoutAggregateStrategy';
import CheckoutDocument from '../../Documents/CheckoutDocument';
import Checkout from '../../../Core/Models/Domain Models/Checkout/Checkout';
import CheckoutInterface from '../../../Core/Models/Domain Models/Checkout/CheckoutInterface';
import CheckoutItemInterface from '../../../Core/Models/Domain Models/Checkout/CheckoutItemInterface';
import CheckoutItemDocument from '../../Documents/CheckoutItemDocument';
import CheckoutID from '../../../Core/Models/ValueObjects/CheckoutID';
import CustomerID from '../../../Core/Models/ValueObjects/CustomerID';
import Money from '../../../Core/Models/ValueObjects/Money';
import CheckoutState from '../../../Core/Models/ValueObjects/CheckoutState';
import CheckoutItemBuilder from '../../../Core/Models/Builders/CheckoutItemBuilder';
import CreateInstanceOfCheckoutItemState from '../../../Core/Models/Builders/States/CheckoutItemStates/CreateInstanceOfCheckoutItemState';
import CheckoutItemID from '../../../Core/Models/ValueObjects/CheckoutItemID';
import ProductHeader from '../../../Core/Models/ValueObjects/ProductHeader';
import ProductQuantity from '../../../Core/Models/ValueObjects/ProductQuantity';
import ProductID from '../../../Core/Models/ValueObjects/ProductID';
import CheckoutBuilder from '../../../Core/Models/Builders/CheckoutBuilder';
import NullCheckout from '../../../Core/Models/Domain Models/Checkout/NullCheckout';
import ItMustBeConcreteCheckoutBuilderState from '../../../Core/Models/Builders/States/CheckoutAggregateStates/ItMustBeConcreteCheckoutBuilderState';
import PeymentMethod from '../../../Core/Models/ValueObjects/PeymentMethod';
export default class ReadCheckoutAggregateMapper implements CheckoutAggregateMapperStrategy<CheckoutDocument>{
    
    fromAggregateToDataMapper(checkoutDomainModel: Checkout): CheckoutDocument {
        let checkoutItems: CheckoutItemInterface[] = [...checkoutDomainModel.getCheckoutItems().values()]
        let checkoutItemDataMapper = checkoutItems.map(item => {
            return new CheckoutItemDocument(
                item.getUuid().getUuid(), 
                item.getProductBasePrice().getAmount(),
                item.getProductQuantity().getQuantity(),
                item.getProductHeader().getHeader(),
                item.getProductUuid().getUuid(),
                item.getCreatedAt(),
                item.getUpdatedAt()
            ) 
        })
        const checkoutDataMapper = new CheckoutDocument(
            checkoutDomainModel.getUuid().getUuid(),
            checkoutDomainModel.getUserUuid().getUuid(),
            checkoutDomainModel.getSubTotal().getAmount(),
            checkoutDomainModel.getShippingPrice() ? checkoutDomainModel.getShippingPrice().getAmount() : 0 ,
            checkoutDomainModel.getPeymentMethod() ? checkoutDomainModel.getPeymentMethod().getPeymentMethod() : null,
            checkoutDomainModel.getCheckoutState().getState(),
            checkoutItemDataMapper
        )
        return checkoutDataMapper

    }
    
    fromDataMapperToAggregate(_checkoutDataMapper: CheckoutDocument): CheckoutInterface {
        if(!_checkoutDataMapper) return new NullCheckout
        const checkoutDomainObject: CheckoutInterface = CheckoutBuilder.initBuilder(new ItMustBeConcreteCheckoutBuilderState())
                                .checkoutUuid(() => new CheckoutID(_checkoutDataMapper._id))
                                .userUuid(() => new CustomerID(_checkoutDataMapper.customerUuid))
                                .subTotal(() => new Money(_checkoutDataMapper.subTotal))
                                .peymentMethod(PeymentMethod.nullableConstruct(_checkoutDataMapper.peymentMethod))
                                .shippingPrice(new Money(_checkoutDataMapper.shippingPrice))
                                .checkoutState(() => new CheckoutState(_checkoutDataMapper.checkoutState))
                                .checkoutItemsMap( new Map<string, CheckoutItemInterface>(_checkoutDataMapper.checkoutItemDocument.map(item => {
                                    return [
                                        item.uuid, CheckoutItemBuilder.initBuilder(new CreateInstanceOfCheckoutItemState)
                                                        .checkoutItemUuid(() => new CheckoutItemID(item.uuid))
                                                        .checkoutUuid(() => new CheckoutID(_checkoutDataMapper._id))
                                                        .checkoutProductHeader(() => new ProductHeader(item.productHeader))
                                                        .checkoutProductBasePrice(() => new Money(item.productBasePrice))
                                                        .checkoutProductQuantity(() => new ProductQuantity(item.productQuantity))
                                                        .checkoutProductUuid(() => new ProductID(item.productUuid))
                                                        .checkoutCreatedAt(item.createdDate)
                                                        .checkoutUpdatedAt(item.updatedDate)
                                                        .build()
                                                    ]
                                                }))
                                            )
                                .createdAt(_checkoutDataMapper.createdDate)
                                .updatedAt(_checkoutDataMapper.updatedDate)    
                                .build()
        return checkoutDomainObject

    }
    
    fromDataMapperArrayToAggrageteArray(_checkoutDataMapper: CheckoutDocument[]): CheckoutInterface[] {
        return _checkoutDataMapper.map(_checkout => {
            
            if(!_checkout) return new NullCheckout

            const checkoutDomainObject: CheckoutInterface = CheckoutBuilder.initBuilder(new ItMustBeConcreteCheckoutBuilderState())
                                    .checkoutUuid(() => new CheckoutID(_checkout._id))
                                    .userUuid(() => new CustomerID(_checkout.customerUuid))
                                    .subTotal(() => new Money(_checkout.subTotal))
                                    .peymentMethod(PeymentMethod.nullableConstruct(_checkout.peymentMethod))
                                    .shippingPrice(new Money(_checkout.shippingPrice))
                                    .checkoutState(() => new CheckoutState(_checkout.checkoutState))
                                    .checkoutItemsMap(new Map<string, CheckoutItemInterface>(_checkout.checkoutItemDocument.map(item => {
                                        return [
                                            item.uuid, 
                                            CheckoutItemBuilder.initBuilder(new CreateInstanceOfCheckoutItemState)
                                                            .checkoutItemUuid(() => new CheckoutItemID(item.uuid))
                                                            .checkoutUuid(() => new CheckoutID(_checkout._id))
                                                            .checkoutProductHeader(() => new ProductHeader(item.productHeader))
                                                            .checkoutProductBasePrice(() => new Money(item.productBasePrice))
                                                            .checkoutProductQuantity(() => new ProductQuantity(item.productQuantity))
                                                            .checkoutProductUuid(() => new ProductID(item.productUuid))
                                                            .checkoutCreatedAt(item.createdDate)
                                                            .checkoutUpdatedAt(item.updatedDate)
                                                            .build()
                                        ]
                                    })))
                                    .createdAt(_checkout.createdDate)
                                    .updatedAt(_checkout.updatedDate)    
                                    .build()
            return checkoutDomainObject
    
        })

    }

}