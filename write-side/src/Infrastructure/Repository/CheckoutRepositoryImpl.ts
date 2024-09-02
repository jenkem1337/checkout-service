import Checkout from '../../Core/Models/Domain Models/Checkout/Checkout';
import { EntityManager, QueryRunner } from 'typeorm';
import CheckoutRepository from '../../Core/Interfaces/CheckoutRepository';
import CheckoutInterface from '../../Core/Models/Domain Models/Checkout/CheckoutInterface';
import CheckoutDataMapper from '../Entity/CheckoutDataMapper';
import CheckoutAggregateMapperContext from './Mapper/CheckoutAggregateMapperContext';
import CheckoutAggregateMapperStrategy from '../../Core/Interfaces/CheckoutAggregateStrategy';
import CheckoutItemDataMapper from '../Entity/CheckoutItemDataMapper';

export default class CheckoutRepositoryImpl implements CheckoutRepository{
        
    private readonly objectMapper: CheckoutAggregateMapperStrategy<CheckoutDataMapper>
    
    constructor(
        private readonly entityManager:EntityManager,
        objectMapperContext:CheckoutAggregateMapperContext
    ){
        this.objectMapper = objectMapperContext.getMapperStrategy();
    }
    
    async saveChanges(checkout: Checkout): Promise<void> {
        const checkoutDataMapper = this.objectMapper.fromAggregateToDataMapper(checkout)
        await this.entityManager.save(checkoutDataMapper)
    }
    async removeCheckoutItemByUuid(uuid:string, queryRunner?:QueryRunner) {
        await this.entityManager.remove(
            await this.entityManager.findOne(CheckoutItemDataMapper, {
                where: {
                    uuid: uuid
                }
            })
        )
    }
    async findOneByUuidAndCustomerUuid(uuid: string, customerUuid: string): Promise<CheckoutInterface> {
        
        const _checkoutDataMapper = await this.entityManager.findOne(CheckoutDataMapper,{
            relations: {
                checkoutItems:true
            },
            where: {
                uuid: uuid,
                customerUuid:customerUuid
            }
        }) ?? CheckoutDataMapper.createNull()
        
        return this.objectMapper.fromDataMapperToAggregate(_checkoutDataMapper)

    }
    async findManyByCustomerUuid(custormerUuid: string): Promise<CheckoutInterface[]> {
        
        const _checkoutDataMapper = await this.entityManager.find(CheckoutDataMapper,{
            relations: {
                checkoutItems:true
            },
            where: {
                customerUuid: custormerUuid
            }
        }) ?? [CheckoutDataMapper.createNull()]

        return this.objectMapper.fromDataMapperArrayToAggrageteArray(_checkoutDataMapper)

    }
    async findOneByUuid(_uuid: string): Promise<CheckoutInterface> {
        const _checkoutDataMapper = await this.entityManager.findOne(CheckoutDataMapper, {
            relations: {
                checkoutItems:true
            },
            where: {
                uuid: _uuid
            }
        }) ?? CheckoutDataMapper.createNull()
        return this.objectMapper.fromDataMapperToAggregate(_checkoutDataMapper)
    }
    async findManyByUuid(uuid: string): Promise<Array<CheckoutInterface>> {
        const _checkoutDataMapper = await this.entityManager.find(CheckoutDataMapper,{
            relations: {
                checkoutItems:true
            },
            where: {
                uuid: uuid
            }
        }) ?? [CheckoutDataMapper.createNull()]

        return this.objectMapper.fromDataMapperArrayToAggrageteArray(_checkoutDataMapper)
    }
    
}