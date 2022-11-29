import CheckoutItemInterface from "../../../Core/Models/Domain Models/Checkout/CheckoutItemInterface";
import CheckoutItemDataMapper from "../../../Infrastructure/Entity/CheckoutItem";
import Checkout from "../../../Core/Models/Domain Models/Checkout/Checkout";
import CheckoutDataMapper from '../../Entity/Checkout';
import CheckoutInterface from '../../../Core/Models/Domain Models/Checkout/CheckoutInterface';
import CheckoutItemBuilder from "../../../Core/Models/Builders/CheckoutItemBuilder";
import CheckoutBuilder from "../../../Core/Models/Builders/CheckoutBuilder";
import CreateInstanceOfCheckoutItemState from "../../../Core/Models/Builders/States/CheckoutItemStates/CreateInstanceOfCheckoutItemState";
import CheckoutID from "../../../Core/Models/ValueObjects/CheckoutID";
import CheckoutItemID from "../../../Core/Models/ValueObjects/CheckoutItemID";
import CheckoutState from "../../../Core/Models/ValueObjects/CheckoutState";
import CustomerID from "../../../Core/Models/ValueObjects/CustomerID";
import Money from "../../../Core/Models/ValueObjects/Money";
import PeymentMethod from "../../../Core/Models/ValueObjects/PeymentMethod";
import ProductHeader from "../../../Core/Models/ValueObjects/ProductHeader";
import ProductID from "../../../Core/Models/ValueObjects/ProductID";
import ProductQuantity from "../../../Core/Models/ValueObjects/ProductQuantity";
import NullCheckout from '../../../Core/Models/Domain Models/Checkout/NullCheckout';
import ItMustBeConcreteCheckoutBuilderState from '../../../Core/Models/Builders/States/CheckoutAggregateStates/ItMustBeConcreteCheckoutBuilderState';

export default class CheckoutAggregateMapper {
    static fromAggregateToDataMapper(checkout:Checkout):CheckoutDataMapper{
        let checkoutItems: CheckoutItemInterface[] = [...checkout.getCheckoutItems().values()]
        let checkoutItemDataMapper = checkoutItems.map(item => {
            return new CheckoutItemDataMapper(
                item.getUuid().getUuid(), 
                item.getProductBasePrice().getAmount(),
                item.getProductQuantity().getQuantity(),
                item.getProductHeader().getHeader(),
                item.getProductUuid().getUuid()
            ) 
        })
        const checkoutDataMapper = new CheckoutDataMapper(
            checkout.getUuid().getUuid(),
            checkout.getUserUuid().getUuid(),
            checkout.getSubTotal().getAmount(),
            checkout.getShippingPrice() ? checkout.getShippingPrice().getAmount() : 0 ,
            checkout.getPeymentMethod() ? checkout.getPeymentMethod().getPeymentMethod() : null,
            checkout.getCheckoutState().getState(),
            checkoutItemDataMapper
        )
        return checkoutDataMapper
    }

    static fromDataMapperToAggregate(_checkoutDataMapper: CheckoutDataMapper):CheckoutInterface {
        if(!_checkoutDataMapper) return new NullCheckout
        const checkoutDomainObject: CheckoutInterface = CheckoutBuilder.initBuilder(new ItMustBeConcreteCheckoutBuilderState())
                                                                    .checkoutUuid(() => new CheckoutID(_checkoutDataMapper.uuid))
                                                                    .userUuid(() => new CustomerID(_checkoutDataMapper.customerUuid))
                                                                    .subTotal(() => new Money(_checkoutDataMapper.subTotal))
                                                                    .peymentMethod(PeymentMethod.nullableConstruct(_checkoutDataMapper.peymentMethod))
                                                                    .shippingPrice(new Money(_checkoutDataMapper.shippingPrice))
                                                                    .checkoutState(() => new CheckoutState(_checkoutDataMapper.checkoutState))
                                                                    .checkoutItemsMap( new Map<string, CheckoutItemInterface>(_checkoutDataMapper.checkoutItems.map(item => {
                                                                        return [
                                                                            item.uuid, 
                                                                            CheckoutItemBuilder.initBuilder(new CreateInstanceOfCheckoutItemState)
                                                                                            .checkoutItemUuid(() => new CheckoutItemID(item.uuid))
                                                                                            .checkoutUuid(() => new CheckoutID(_checkoutDataMapper.uuid))
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

    static fromDataMapperArrayToAggrageteArray(_checkoutDataMapper: CheckoutDataMapper[]):CheckoutInterface[]{
        return _checkoutDataMapper.map(_checkout => {
            
            if(!_checkout) return new NullCheckout

            const checkoutDomainObject: CheckoutInterface = CheckoutBuilder.initBuilder(new ItMustBeConcreteCheckoutBuilderState())
                                                                        .checkoutUuid(() => new CheckoutID(_checkout.uuid))
                                                                        .userUuid(() => new CustomerID(_checkout.customerUuid))
                                                                        .subTotal(() => new Money(_checkout.subTotal))
                                                                        .peymentMethod(PeymentMethod.nullableConstruct(_checkout.peymentMethod))
                                                                        .shippingPrice(new Money(_checkout.shippingPrice))
                                                                        .checkoutState(() => new CheckoutState(_checkout.checkoutState))
                                                                        .checkoutItemsMap(new Map<string, CheckoutItemInterface>(_checkout.checkoutItems.map(item => {
                                                                            return [
                                                                                item.uuid, 
                                                                                CheckoutItemBuilder.initBuilder(new CreateInstanceOfCheckoutItemState)
                                                                                                .checkoutItemUuid(() => new CheckoutItemID(item.uuid))
                                                                                                .checkoutUuid(() => new CheckoutID(_checkout.uuid))
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