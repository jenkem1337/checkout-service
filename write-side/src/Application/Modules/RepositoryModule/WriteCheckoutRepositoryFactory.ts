import { Module } from "@nestjs/common";
import CheckoutAggregateMapperContext from '../../../Infrastructure/Repository/Mapper/CheckoutAggregateMapperContext';
import WriteCheckoutAggregateMapper from '../../../Infrastructure/Repository/Mapper/WriteCheckoutAggregateMapper';
import { IDomainModelFactoryContext } from '../../../Core/Models/Factories/DomainModelFactoryContext';
import DomainModelFactoryModule from "../DomainModelFactoryModule";
import CheckoutRepositoryFactory from "src/Infrastructure/Repository/CheckoutRepositoryFactory";
import EntityManagerFactoryModule from "./EntityManagerFactoryModule";
import IEntityManagerFactory from "src/Core/Interfaces/IEntityManagerFactory";
import ICheckoutRepositoryFactory from "src/Core/Interfaces/ICheckoutRepositoryFactory";

@Module({
    providers: [
        DomainModelFactoryModule,
        EntityManagerFactoryModule,
    {
        provide:"CheckoutRepositoryFactory",
        useFactory: (domainModelFactoryCtx: IDomainModelFactoryContext, enf: IEntityManagerFactory):ICheckoutRepositoryFactory => {
            const context = new CheckoutAggregateMapperContext
            context.setStrategy(new WriteCheckoutAggregateMapper(domainModelFactoryCtx))
            return new CheckoutRepositoryFactory(enf, context)
        },
        inject: ["DomainModelFactoryContext", "EntityManagerFactory"]
    }],
    imports: [DomainModelFactoryModule, EntityManagerFactoryModule],
    exports:["CheckoutRepositoryFactory"]
    
})
export default class WriteRepositoryFactoryModule {}