import CheckoutItemInterface from "../../../Core/Models/Domain Models/Checkout/CheckoutItemInterface";
import CheckoutItemDataMapper from "../../Entity/CheckoutItemDataMapper";
import Checkout from "../../../Core/Models/Domain Models/Checkout/Checkout";
import CheckoutDataMapper from '../../Entity/CheckoutDataMapper';
import CheckoutInterface from '../../../Core/Models/Domain Models/Checkout/CheckoutInterface';
import CheckoutAggregateMapperStrategy from '../../../Core/Interfaces/CheckoutAggregateStrategy';
import { IDomainModelFactoryContext } from '../../../Core/Models/Factories/DomainModelFactoryContext';
import NullableAllArgumentCheckoutFactory from "../../../Core/Models/Factories/Checkout/NullableAllArgumentCheckoutFactory";
import CheckoutConstructorParamaters from "../../../Core/Models/Factories/Checkout/CheckoutConstructorParameters";
import NullableCheckoutItemFactory from '../../../Core/Models/Factories/CheckoutItem/NullableCheckoutItemFactory';
import CheckoutItemConstructorParameters from "src/Core/Models/Factories/CheckoutItem/CheckoutItemConstructorParameters";

export default class WriteCheckoutAggregateMapper implements CheckoutAggregateMapperStrategy<CheckoutDataMapper>{
    
    constructor(
        private readonly domainModelFactoryCtx: IDomainModelFactoryContext
    ){}
    
    fromAggregateToDataMapper(checkout:Checkout):CheckoutDataMapper{
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
            checkout.getCheckoutState().getState(),
        )
        checkoutItemDataMapper.forEach(item => {
            item.checkout = checkoutDataMapper
        })

        checkoutDataMapper.checkoutItems = checkoutItemDataMapper
        return checkoutDataMapper
    }

    fromDataMapperToAggregate(_checkoutDataMapper: CheckoutDataMapper):CheckoutInterface {
        let checkoutItemFactory = this.domainModelFactoryCtx.directlyGetFactoryMethod<CheckoutItemInterface, CheckoutItemConstructorParameters>(NullableCheckoutItemFactory.name)
        let checkoutDomainObject: CheckoutInterface = this.domainModelFactoryCtx.setFactoryMethod(NullableAllArgumentCheckoutFactory.name)
                                                                            .createInstance<CheckoutInterface, CheckoutConstructorParamaters>({
                                                                                checkoutState: _checkoutDataMapper.checkoutState,
                                                                                checkoutUuid: _checkoutDataMapper.uuid,
                                                                                createdAt: _checkoutDataMapper.createdDate,
                                                                                updatedAt: _checkoutDataMapper.updatedDate,
                                                                                userUuid: _checkoutDataMapper.customerUuid,
                                                                                checkoutItems: new Map<string, CheckoutItemInterface>(_checkoutDataMapper.checkoutItems.map(item => {
                                                                                    return [
                                                                                        item.uuid,
                                                                                        checkoutItemFactory.createInstance({
                                                                                            checkoutItemUuid: item.uuid,
                                                                                            checkoutUuid: _checkoutDataMapper.uuid,
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

    fromDataMapperArrayToAggrageteArray(_checkoutDataMapper: CheckoutDataMapper[]):CheckoutInterface[]{
        return _checkoutDataMapper.map(_checkout => {
            

            let checkoutItemFactory = this.domainModelFactoryCtx.directlyGetFactoryMethod<CheckoutItemInterface, CheckoutItemConstructorParameters>(NullableCheckoutItemFactory.name)
            let checkoutDomainObject: CheckoutInterface = this.domainModelFactoryCtx.setFactoryMethod(NullableAllArgumentCheckoutFactory.name)
                                                                                .createInstance<CheckoutInterface, CheckoutConstructorParamaters>({
                                                                                    checkoutState: _checkout.checkoutState,
                                                                                    checkoutUuid: _checkout.uuid,
                                                                                    createdAt: _checkout.createdDate,
                                                                                    updatedAt: _checkout.updatedDate,
                                                                                    userUuid: _checkout.customerUuid,
                                                                                    checkoutItems: new Map<string, CheckoutItemInterface>(_checkout.checkoutItems.map(item => {
                                                                                        return [
                                                                                            item.uuid,
                                                                                            checkoutItemFactory.createInstance({
                                                                                                checkoutItemUuid: item.uuid,
                                                                                                checkoutUuid: _checkout.uuid,
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