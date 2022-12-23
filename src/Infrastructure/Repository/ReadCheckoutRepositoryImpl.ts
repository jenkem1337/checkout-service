import Checkout from '../../Core/Models/Domain Models/Checkout/Checkout';
import CheckoutInterface from '../../Core/Models/Domain Models/Checkout/CheckoutInterface';
import ReadCheckoutRepository from '../../Core/Interfaces/ReadCheckoutRepository';
import { DataSource } from 'typeorm';
import { Inject } from '@nestjs/common';
import CheckoutDocument from '../Documents/CheckoutDocument';
import CheckoutAggregateMapperContext from './Mapper/CheckoutAggregateMapperContext';
import CheckoutAggregateMapperStrategy from './Mapper/CheckoutAggregateStrategy';
export default class ReadCheckoutRepositoryImpl implements ReadCheckoutRepository{
    
    protected readonly dataSoruce:DataSource
    private readonly objectMapper: CheckoutAggregateMapperStrategy<CheckoutDocument>
    constructor(
        @Inject("MongoDataSource") dataSource:DataSource,
        @Inject(CheckoutAggregateMapperContext.name) objectMapperContext:CheckoutAggregateMapperContext
    ){
        this.dataSoruce = dataSource
        this.objectMapper = objectMapperContext.getMapperStrategy()
    }
    async saveChanges(checkout: Checkout): Promise<void> {
        const checkoutDataMapper = this.objectMapper.fromAggregateToDataMapper(checkout)
        await this.dataSoruce.mongoManager.save(checkoutDataMapper)
    }

    async updateCheckoutItemDocument(checkout: Checkout){
        const checkoutDataMapper = this.objectMapper.fromAggregateToDataMapper(checkout)
        await this.dataSoruce.mongoManager.updateOne(
            CheckoutDocument, 
            {"_id":checkoutDataMapper._id},
            {$set: {
                "checkoutItemDocument": checkoutDataMapper.checkoutItemDocument,
                "subTotal": checkoutDataMapper.subTotal
            }}
        )

    }
    async findOneByUuid(_uuid: string): Promise<CheckoutInterface> {
        const _checkoutDataMapper = await this.dataSoruce.mongoManager.findOne(CheckoutDocument, {
            where: {
                _id: _uuid
            }
        })
        return this.objectMapper.fromDataMapperToAggregate(_checkoutDataMapper)
    }
    async findManyByUuid(uuid: string): Promise<Array<CheckoutInterface>> {
        const _checkoutDataMapper = await this.dataSoruce.mongoManager.find(CheckoutDocument, {
            where: {
                _id: uuid,
            }
        })

        return this.objectMapper.fromDataMapperArrayToAggrageteArray(_checkoutDataMapper)
    }
}