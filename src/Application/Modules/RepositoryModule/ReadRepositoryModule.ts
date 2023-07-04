import { Module } from "@nestjs/common";
import ReadCheckoutRepositoryImpl from '../../../Infrastructure/Repository/ReadCheckoutRepositoryImpl';
import CheckoutAggregateMapperContext from '../../../Infrastructure/Repository/Mapper/CheckoutAggregateMapperContext';
import { IDomainModelFactoryContext } from '../../../Core/Models/Factories/DomainModelFactoryContext';
import ReadCheckoutAggregateMapper from '../../../Infrastructure/Repository/Mapper/ReadCheckoutAggregateMapper';
import DomainModelFactoryModule from '../DomainModelFactoryModule';
import MongoORMModule from '../ORMModule/MongoOrmModule';

@Module({
    providers: [{
        useClass:ReadCheckoutRepositoryImpl,
        provide:"ReadCheckoutRepository"
    }, {
        provide: CheckoutAggregateMapperContext.name,
        useFactory: (domainModelFactoryCtx: IDomainModelFactoryContext) => {
            const context = new CheckoutAggregateMapperContext
            context.setStrategy(new ReadCheckoutAggregateMapper(domainModelFactoryCtx))
            return context;
        },
        inject: [{token: "DomainModelFactoryContext", optional:false}]
}],
    imports: [MongoORMModule, DomainModelFactoryModule]
})
export default class ReadRepositoryModule {}