import Checkout from '../../Core/Models/Domain Models/Checkout/Checkout';
import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import CheckoutRepository from '../../Core/Interfaces/CheckoutRepository';
import CheckoutInterface from '../../Core/Models/Domain Models/Checkout/CheckoutInterface';
import CheckoutDataMapper from '../Entity/CheckoutDataMapper';
import CheckoutAggregateMapperContext from './Mapper/CheckoutAggregateMapperContext';
import CheckoutAggregateMapperStrategy from './Mapper/CheckoutAggregateStrategy';

@Injectable()
export default class CheckoutRepositoryImpl implements CheckoutRepository{
    
    private readonly objectMapperContext: CheckoutAggregateMapperContext
    
    private objectMapper: CheckoutAggregateMapperStrategy<CheckoutDataMapper>
    
    private readonly dataSoruce:DataSource
    constructor(
        @Inject("DataSource") dataSource:DataSource,
        @Inject(CheckoutAggregateMapperContext.name) objectMapperContext:CheckoutAggregateMapperContext
    ){
        this.dataSoruce = dataSource
        this.objectMapperContext = objectMapperContext
        this.objectMapper = this.objectMapperContext.getMapperStrategy();
    }
    async saveChanges(checkout: Checkout): Promise<void> {
        const checkoutDataMapper = this.objectMapper.fromAggregateToDataMapper(checkout)
        await this.dataSoruce.manager.save(checkoutDataMapper)
    }

    async findOneByUuidAndCustomerUuid(uuid: string, customerUuid: string): Promise<CheckoutInterface> {
        const _checkoutDataMapper = await this.dataSoruce.manager.findOne(CheckoutDataMapper, {
            relations: {
                checkoutItems:true
            },
            where: {
                uuid: uuid,
                customerUuid:customerUuid
            }
        })
        
        return this.objectMapper.fromDataMapperToAggregate(_checkoutDataMapper)

    }
    async findManyByCustomerUuid(custormerUuid: string): Promise<CheckoutInterface[]> {
        
        const _checkoutDataMapper = await this.dataSoruce.manager.find(CheckoutDataMapper, {
            relations: {
                checkoutItems:true
            },
            where: {
                customerUuid: custormerUuid
            }
        })

        return this.objectMapper.fromDataMapperArrayToAggrageteArray(_checkoutDataMapper)

    }
    async findOneByUuid(_uuid: string): Promise<CheckoutInterface> {
        const _checkoutDataMapper = await this.dataSoruce.manager.findOne(CheckoutDataMapper, {
            relations: {
                checkoutItems:true
            },
            where: {
                uuid: _uuid
            }
        })
        return this.objectMapper.fromDataMapperToAggregate(_checkoutDataMapper)
    }
    async findManyByUuid(uuid: string): Promise<Array<CheckoutInterface>> {
        const _checkoutDataMapper = await this.dataSoruce.manager.find(CheckoutDataMapper, {
            relations: {
                checkoutItems:true
            },
            where: {
                uuid: uuid
            }
        })

        return this.objectMapper.fromDataMapperArrayToAggrageteArray(_checkoutDataMapper)
    }
    
}