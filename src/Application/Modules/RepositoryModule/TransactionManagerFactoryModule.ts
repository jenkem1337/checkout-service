import { Module } from "@nestjs/common";
import { ClsModule, ClsService } from "nestjs-cls";
import TransactionManagerFactory from "src/Infrastructure/Repository/TransactionManagerFactory";
import { DataSource, QueryRunner } from "typeorm";
import PostGreDataSourceModule from "../DatabaseConnectionModule/PostGreDataSourceModule";
import ITransactionManagerFactory from "src/Core/Interfaces/ITransactionManagerFactory";
import { AlsModule } from "../AlsModule";
import { AsyncLocalStorage } from "async_hooks";

@Module({
    providers:[
        AlsModule,
        PostGreDataSourceModule,

        {
            provide:"TransactionManagerFactory",
            useFactory: (dataSource:DataSource, alsService:AsyncLocalStorage<Map<string,QueryRunner>>): ITransactionManagerFactory => {
                return new TransactionManagerFactory(dataSource, alsService)
            },
            inject:["DataSource", AsyncLocalStorage]
        }
    ], 
    exports:["TransactionManagerFactory"], 
    imports:[PostGreDataSourceModule, AlsModule]
})
export default class TransactionManagerFactoryModule{}