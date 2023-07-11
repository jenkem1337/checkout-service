import { Module } from "@nestjs/common";
import CheckoutRepositoryImpl from '../../../Infrastructure/Repository/CheckoutRepositoryImpl';
import PostGreDataSourceModule from "../DatabaseConnectionModule/PostGreDataSourceModule";
import CheckoutAggregateMapperContext from '../../../Infrastructure/Repository/Mapper/CheckoutAggregateMapperContext';
import WriteCheckoutAggregateMapper from '../../../Infrastructure/Repository/Mapper/WriteCheckoutAggregateMapper';
import { IDomainModelFactoryContext } from '../../../Core/Models/Factories/DomainModelFactoryContext';
import DomainModelFactoryModule from "../DomainModelFactoryModule";

@Module({
    providers: [
        DomainModelFactoryModule,
    {
        
        provide:"CheckoutRepository",
        useClass: CheckoutRepositoryImpl
    }, 
    {
        provide: CheckoutAggregateMapperContext.name,
        useFactory: (domainModelFactoryCtx: IDomainModelFactoryContext) => {
            const context = new CheckoutAggregateMapperContext
            context.setStrategy(new WriteCheckoutAggregateMapper(domainModelFactoryCtx))
            return context;
        },
        inject: [{token: "DomainModelFactoryContext", optional:false}]
    }],
    imports: [PostGreDataSourceModule, DomainModelFactoryModule],
    exports:["CheckoutRepository"]
    
})
export default class WriteRepositoryModule {}