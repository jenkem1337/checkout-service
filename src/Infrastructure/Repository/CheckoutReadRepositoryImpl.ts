import { Inject } from '@nestjs/common';
import {MongoClient } from 'mongodb';
import CheckoutQueryModel from '../../Core/Models/QueryModels/CheckoutQueryModel';
import CheckoutReadRepository from '../../Core/Interfaces/CheckoutReadRepository';
export default class CheckoutReadRepositoryImpl implements CheckoutReadRepository{
    
    protected readonly checkoutDatabase:MongoClient 
    constructor(
        @Inject("MongoDataSource") checkoutDatabase: MongoClient,
    ){
        this.checkoutDatabase = checkoutDatabase
    }
    async save(checkout: CheckoutQueryModel): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async updateByUuid(checkout: CheckoutQueryModel): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async deleteByUuid(uuid: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async findOneByUuidAndCustomerUuid(uuid: string, customerUuid: string): Promise<CheckoutQueryModel> {
        throw new Error('Method not implemented.');

    }
    async findManyByCustomerUuid(custormerUuid: string): Promise<CheckoutQueryModel[]> {
        throw new Error('Method not implemented.');

    }
    async findOneByUuid(_uuid: string): Promise<CheckoutQueryModel> {
        throw new Error('Method not implemented.');
    }
}