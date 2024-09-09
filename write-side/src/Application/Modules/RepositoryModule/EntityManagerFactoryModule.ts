import { Module } from "@nestjs/common";
import { ClsModule, ClsService } from "nestjs-cls";
import EntityManagerFactory from "src/Infrastructure/Repository/EntityManagerFactory";
import { DataSource, QueryRunner } from "typeorm";
import PostGreDataSourceModule from "../DatabaseConnectionModule/PostGreDataSourceModule";
import IEntityManagerFactory from "src/Core/Interfaces/IEntityManagerFactory";
import { AlsModule } from "../AlsModule";
import { AsyncLocalStorage } from "async_hooks";

@Module({
    providers:[
        AlsModule,
        PostGreDataSourceModule,
        {
            provide:"EntityManagerFactory",
            useFactory: (alsService:AsyncLocalStorage<Map<string,QueryRunner>>, dataSource:DataSource):IEntityManagerFactory => {
                return new EntityManagerFactory(dataSource, alsService)
            },
            inject:[AsyncLocalStorage, "DataSource"]
        }
    ], 
    exports:["EntityManagerFactory"],
    imports: [AlsModule, PostGreDataSourceModule]
})
export default class EntityManagerFactoryModule {

}