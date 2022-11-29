import CheckoutRepositoryImpl from "./CheckoutRepositoryImpl";
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export default class InMemoryCheckoutRepositoryImpl extends CheckoutRepositoryImpl {
    constructor(@Inject("TestDataSource") testDataSource:DataSource){
        super(testDataSource)
    }
}