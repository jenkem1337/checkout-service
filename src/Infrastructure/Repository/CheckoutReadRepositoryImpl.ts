import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { Inject, Injectable } from '@nestjs/common';
import { MongoClient, Db , ObjectId} from 'mongodb';
import CheckoutQueryModel from '../../Core/Models/QueryModels/CheckoutQueryModel';
import CheckoutReadRepository from '../../Core/Interfaces/CheckoutReadRepository';
import CheckoutItemQueryModel from '../../Core/Models/QueryModels/CheckoutItemQueryModel';
import QueryModel from '../../Core/Models/QueryModels/QueryModel';
import NullCheckoutQueryModel from '../../Core/Models/QueryModels/NullCheckoutQueryModel';

interface MongoCheckoutDocument {
    _id: string,
    customerUuid: string,
    subTotal: number,
    state: string,
    shippingPrice: number,
    peymentMethod: string,
    createdAt: Date
    updatedAt: Date
}
interface MongoCheckoutItemDocument {
    _id: string
    basePrice:number,
    quantity:number
    header:string
    productUuid: string,
    checkoutUuid: string
    createdAt: Date,
    updatedAt: Date
}
@Injectable()
export default class CheckoutReadRepositoryImpl implements CheckoutReadRepository{
    
    protected readonly mongoClient:Db 
    constructor(
        @Inject("MongoDataSource") mongoClient: Db,
    ){
        this.mongoClient = mongoClient
    }
    async updateStateByUuid(uuid: string, state: string): Promise<void> {
        await this.mongoClient.collection<MongoCheckoutItemDocument>("checkouts").findOneAndUpdate(
            {
                _id: (uuid)
            }, 
            {
                $set: {
                    state: state,
                    updatedAt: new Date        
                }
        })

    }
    async save(checkout: CheckoutQueryModel): Promise<void> {
        await this.mongoClient.collection<MongoCheckoutDocument>("checkouts").insertOne({
            _id: checkout.uuid,
            customerUuid: checkout.customerUuid,
            subTotal: checkout.subTotal,
            state: checkout.checkoutState,
            shippingPrice: checkout.shippingPrice,
            peymentMethod: checkout.peymentMethod,
            createdAt: checkout.createdDate,
            updatedAt: checkout.updatedDate
        })
    }
    async saveCheckoutItem(item: CheckoutItemQueryModel) {
        await this.mongoClient.collection<MongoCheckoutItemDocument>("checkout_items").insertOne({
            _id: (item.uuid),
            basePrice:item.productBasePrice,
            quantity:item.productQuantity,
            header:item.productHeader,
            productUuid: item.productUuid,
            checkoutUuid: item.checkoutUuid,
            createdAt: item.createdDate,
            updatedAt: item.updatedDate
        })

    }
    async updateByUuid(checkout: CheckoutQueryModel): Promise<void> {
        await this.mongoClient.collection<MongoCheckoutItemDocument>("checkouts").findOneAndUpdate(
            {
                _id: (checkout.uuid)
            }, 
            {
                $set: {
                    subTotal: checkout.subTotal,
                    state: checkout.checkoutState,
                    shippingPrice: checkout.shippingPrice,
                    peymentMethod: checkout.peymentMethod,
                    updatedAt: checkout.updatedDate        
                }
        })
    }
    async deleteCheckoutItemByUuid(uuid: string): Promise<void> {
        await this.mongoClient.collection<MongoCheckoutItemDocument>("checkout_items").deleteOne({
            _id: (uuid)
        })
    }
    async findOneByUuidAndCustomerUuid(checkoutUuid: string, customerUuid: string): Promise<QueryModel> {
        const checkoutDocument = await this.mongoClient.collection<MongoCheckoutDocument>("checkouts").findOne(
            {
                _id: (checkoutUuid),
                customerUuid: customerUuid
            })
        if(!checkoutDocument){
            return NullCheckoutQueryModel.valueOf()
        }
    
        const checkoutItems = await this.mongoClient.collection<MongoCheckoutItemDocument>("checkout_items")
                                                .find({checkoutUuid: checkoutUuid})
                                                .map(item => CheckoutItemQueryModel.valueOf({
                                                    checkoutUuid:item.checkoutUuid,
                                                    uuid: item._id,
                                                    createdDate: item.createdAt,
                                                    productBasePrice: item.basePrice,
                                                    productHeader: item.header,
                                                    productQuantity: item.quantity,
                                                    productUuid:item.productUuid,
                                                    updatedDate:item.updatedAt
                                                }))
                                                .toArray()
        return CheckoutQueryModel.valueOf({
            uuid: checkoutDocument._id.toString(),
            customerUuid: checkoutDocument.customerUuid,
            checkoutItemDocument: checkoutItems,
            checkoutState: checkoutDocument.state,
            createdDate: checkoutDocument.createdAt,
            peymentMethod: checkoutDocument.peymentMethod,
            shippingPrice: checkoutDocument.shippingPrice,
            subTotal: checkoutDocument.subTotal,
            updatedDate: checkoutDocument.updatedAt
        })
    }
    async findManyByCustomerUuid(customerUuid: string): Promise<QueryModel[]> {
        
        const checkoutDocuments = this.mongoClient.collection<MongoCheckoutDocument>("checkouts")
                                                    .find({customerUuid: customerUuid})
        let checkoutQueryModelArr: Array<QueryModel> = []
        for await ( const checkout of checkoutDocuments) {
            let checkoutItems = await this.mongoClient.collection<MongoCheckoutItemDocument>("checkout_items")
                                                    .find({
                                                        checkoutUuid: checkout._id
                                                    }).map(checkoutItem => CheckoutItemQueryModel.valueOf({
                                                        checkoutUuid:checkoutItem.checkoutUuid,
                                                        createdDate:checkoutItem.createdAt,
                                                        productBasePrice: checkoutItem.basePrice,
                                                        productHeader: checkoutItem.header,
                                                        productQuantity: checkoutItem.quantity,
                                                        productUuid: checkoutItem.productUuid,
                                                        updatedDate: checkoutItem.updatedAt,
                                                        uuid: checkout._id
                                                    })).toArray()
            
            checkoutQueryModelArr.push(CheckoutQueryModel.valueOf({
                uuid: checkout._id,
                customerUuid: checkout.customerUuid,
                checkoutState: checkout.state,
                createdDate: checkout.createdAt,
                peymentMethod: checkout.peymentMethod,
                shippingPrice: checkout.shippingPrice,
                subTotal: checkout.subTotal,
                updatedDate: checkout.updatedAt,
                checkoutItemDocument:checkoutItems
            }))
        }
        return checkoutQueryModelArr
    }
    async findOneWithoutItemsByUuid(checkoutUuid:string){
        const checkoutDocument = await this.mongoClient.collection<MongoCheckoutDocument>("checkouts").findOne(
            {
                _id: (checkoutUuid),
            })
            if(!checkoutDocument){
                return NullCheckoutQueryModel.valueOf()
            }
            return CheckoutQueryModel.valueOf({
                uuid: checkoutDocument._id,
                customerUuid: checkoutDocument.customerUuid,
                checkoutState: checkoutDocument.state,
                createdDate: checkoutDocument.createdAt,
                peymentMethod: checkoutDocument.peymentMethod,
                shippingPrice: checkoutDocument.shippingPrice,
                subTotal: checkoutDocument.subTotal,
                updatedDate: checkoutDocument.updatedAt
            })
    
    }
    async findOneByUuid(checkoutUuid: string): Promise<QueryModel> {
        const checkoutDocument = await this.mongoClient.collection<MongoCheckoutDocument>("checkouts").findOne(
            {
                _id: (checkoutUuid),
            })
            if(!checkoutDocument){
                return NullCheckoutQueryModel.valueOf()
            }
    
        const checkoutItems = await this.mongoClient.collection<MongoCheckoutItemDocument>("checkout_items")
                                                .find({checkoutUuid: checkoutUuid})
                                                .map(item => CheckoutItemQueryModel.valueOf({
                                                    checkoutUuid:item.checkoutUuid,
                                                    uuid: item._id,
                                                    createdDate: item.createdAt,
                                                    productBasePrice: item.basePrice,
                                                    productHeader: item.header,
                                                    productQuantity: item.quantity,
                                                    productUuid:item.productUuid,
                                                    updatedDate:item.updatedAt
                                                }))
                                                .toArray()
        return CheckoutQueryModel.valueOf({
            uuid: checkoutDocument._id,
            customerUuid: checkoutDocument.customerUuid,
            checkoutItemDocument: checkoutItems,
            checkoutState: checkoutDocument.state,
            createdDate: checkoutDocument.createdAt,
            peymentMethod: checkoutDocument.peymentMethod,
            shippingPrice: checkoutDocument.shippingPrice,
            subTotal: checkoutDocument.subTotal,
            updatedDate: checkoutDocument.updatedAt
        })

    }
}