import  NullableAllArgumentCheckoutFactory  from '../../../Core/Models/Factories/Checkout/NullableAllArgumentCheckoutFactory';
import { IDomainModelFactoryContext } from './../../../Core/Models/Factories/DomainModelFactoryContext';
import CheckoutAggregateMapperStrategy from './CheckoutAggregateStrategy';
import CheckoutDocument from '../../Documents/CheckoutDocument';
import Checkout from '../../../Core/Models/Domain Models/Checkout/Checkout';
import CheckoutInterface from '../../../Core/Models/Domain Models/Checkout/CheckoutInterface';
import CheckoutItemInterface from '../../../Core/Models/Domain Models/Checkout/CheckoutItemInterface';
import CheckoutItemDocument from '../../Documents/CheckoutItemDocument';
import NullCheckout from '../../../Core/Models/Domain Models/Checkout/NullCheckout';
import CheckoutItemConstructorParameters from '../../../Core/Models/Factories/CheckoutItem/CheckoutItemConstructorParameters';
import NullableCheckoutItemFactory from '../../../Core/Models/Factories/CheckoutItem/NullableCheckoutItemFactory';
import CheckoutConstructorParamaters from '../../../Core/Models/Factories/Checkout/CheckoutConstructorParameters';
export default class ReadCheckoutAggregateMapper implements CheckoutAggregateMapperStrategy<CheckoutDocument>{
    constructor(
        private readonly domainModelFactoryCtx: IDomainModelFactoryContext
    ){}
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
        let checkoutItemFactory = this.domainModelFactoryCtx.directlyGetFactoryMethod<CheckoutItemInterface, CheckoutItemConstructorParameters>(NullableCheckoutItemFactory.name)
        let checkoutDomainObject: CheckoutInterface = this.domainModelFactoryCtx.setFactoryMethod(NullableAllArgumentCheckoutFactory.name)
                                                                            .createInstance<CheckoutInterface, CheckoutConstructorParamaters>({
                                                                                checkoutState: _checkoutDataMapper.checkoutState,
                                                                                checkoutUuid: _checkoutDataMapper._id,
                                                                                createdAt: _checkoutDataMapper.createdDate,
                                                                                subTotal: _checkoutDataMapper.subTotal,
                                                                                updatedAt: _checkoutDataMapper.updatedDate,
                                                                                userUuid: _checkoutDataMapper.customerUuid,
                                                                                peymentMethod: _checkoutDataMapper.peymentMethod,
                                                                                shippingPrice: _checkoutDataMapper.shippingPrice,
                                                                                checkoutItems: new Map<string, CheckoutItemInterface>(_checkoutDataMapper.checkoutItemDocument.map(item => {
                                                                                    return [
                                                                                        item.uuid,
                                                                                        checkoutItemFactory.createInstance({
                                                                                            checkoutItemUuid: item.uuid,
                                                                                            checkoutUuid: _checkoutDataMapper._id,
                                                                                            createdAt: item.createdDate,
                                                                                            productBasePrice: item.productBasePrice,
                                                                                            productHeader: item.productHeader,
                                                                                            productQuantity: item.productQuantity,
                                                                                            productUuid: item.productUuid,
                                                                                            updatedAt: item.updatedDate
                                                                                        })
                                                                                    ]
                                                                                }))

                                                                            })
        
        return checkoutDomainObject

    }
    
    fromDataMapperArrayToAggrageteArray(_checkoutDataMapper: CheckoutDocument[]): CheckoutInterface[] {
        return _checkoutDataMapper.map(_checkout => {
            
            if(!_checkout) return new NullCheckout

            let checkoutItemFactory = this.domainModelFactoryCtx.directlyGetFactoryMethod<CheckoutItemInterface, CheckoutItemConstructorParameters>(NullableCheckoutItemFactory.name)
            let checkoutDomainObject: CheckoutInterface = this.domainModelFactoryCtx.setFactoryMethod(NullableAllArgumentCheckoutFactory.name)
                                                                                .createInstance<CheckoutInterface, CheckoutConstructorParamaters>({
                                                                                    checkoutState: _checkout.checkoutState,
                                                                                    checkoutUuid: _checkout._id,
                                                                                    createdAt: _checkout.createdDate,
                                                                                    subTotal: _checkout.subTotal,
                                                                                    updatedAt: _checkout.updatedDate,
                                                                                    userUuid: _checkout.customerUuid,
                                                                                    peymentMethod: _checkout.peymentMethod,
                                                                                    shippingPrice: _checkout.shippingPrice,
                                                                                    checkoutItems: new Map<string, CheckoutItemInterface>(_checkout.checkoutItemDocument.map(item => {
                                                                                        return [
                                                                                            item.uuid,
                                                                                            checkoutItemFactory.createInstance({
                                                                                                checkoutItemUuid: item.uuid,
                                                                                                checkoutUuid: _checkout._id,
                                                                                                createdAt: item.createdDate,
                                                                                                productBasePrice: item.productBasePrice,
                                                                                                productHeader: item.productHeader,
                                                                                                productQuantity: item.productQuantity,
                                                                                                productUuid: item.productUuid,
                                                                                                updatedAt: item.updatedDate
                                                                                            })
                                                                                        ]
                                                                                    }))
    
                                                                                })
            
                return checkoutDomainObject
    
        })

    }

}