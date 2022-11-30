import Checkout from '../../Core/Models/Domain Models/Checkout/Checkout';
import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import CheckoutRepository from '../../Core/Interfaces/CheckoutRepository';
import CheckoutInterface from '../../Core/Models/Domain Models/Checkout/CheckoutInterface';
import CheckoutDataMapper from '../Entity/Checkout';
import CheckoutAggregateMapper from './Mapper/CheckoutAggregateMapper';

@Injectable()
export default class CheckoutRepositoryImpl implements CheckoutRepository{
    private readonly dataSoruce:DataSource
    constructor(
        @Inject("DataSource") dataSource:DataSource
    ){
        this.dataSoruce = dataSource
    }
    async saveChanges(checkout: Checkout): Promise<void> {
        const checkoutDataMapper = CheckoutAggregateMapper.fromAggregateToDataMapper(checkout)
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
        
        return CheckoutAggregateMapper.fromDataMapperToAggregate(_checkoutDataMapper)

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

        return CheckoutAggregateMapper.fromDataMapperArrayToAggrageteArray(_checkoutDataMapper)

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
        return CheckoutAggregateMapper.fromDataMapperToAggregate(_checkoutDataMapper)
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

        return CheckoutAggregateMapper.fromDataMapperArrayToAggrageteArray(_checkoutDataMapper)
    }
    
}