import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import CheckoutReadRepository from './CheckoutReadRepository';
import CheckoutQueryModel from '../Model/CheckoutQueryModel';
import CheckoutItemQueryModel from '../Model/CheckoutItemQueryModel';
import QueryModel from '../Model/QueryModel';
import NullCheckoutQueryModel from '../Model/NullCheckoutQueryModel';
import NullCheckoutItemQueryModel from '../Model/NullCheckoutItemQuery';

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
    
    constructor(
        @Inject("MongoDataSource") 
        protected readonly mongoClient:Db 
    ){}

    async updateCheckoutItemQuantityByUuid(uuid:string, quantity:number){
        await this.mongoClient.collection<MongoCheckoutItemDocument>("checkout_items").findOneAndUpdate(
            {
                _id: (uuid)
            }, 
            {
                $set: {
                    quantity:quantity,
                    updatedAt: new Date        
                }
        })

    }
    async updateSubTotalByUuid(uuid: string, subTotal:number){
        await this.mongoClient.collection<MongoCheckoutDocument>("checkouts").findOneAndUpdate(
            {
                _id: (uuid)
            }, 
            {
                $set: {
                    subTotal:subTotal,
                    updatedAt: new Date        
                }
        })

    }
    async updateStateByUuid(uuid: string, state: string): Promise<void> {
        await this.mongoClient.collection<MongoCheckoutDocument>("checkouts").findOneAndUpdate(
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
    async findOneCheckoutItemByUuid(uuid:string) {
        const checkoutItemDocument = await this.mongoClient.collection<MongoCheckoutItemDocument>("checkout_items").findOne({
            _id: uuid
        })
        if(!checkoutItemDocument){
            return NullCheckoutItemQueryModel.valueOf()
        }
        return CheckoutItemQueryModel.valueOf({
            checkoutUuid:checkoutItemDocument.checkoutUuid,
            uuid: checkoutItemDocument._id,
            createdDate: checkoutItemDocument.createdAt,
            productBasePrice: checkoutItemDocument.basePrice,
            productHeader: checkoutItemDocument.header,
            productQuantity: checkoutItemDocument.quantity,
            productUuid:checkoutItemDocument.productUuid,
            updatedDate:checkoutItemDocument.updatedAt

        })
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