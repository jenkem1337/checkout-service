import { Module } from "@nestjs/common";
import CheckoutRepositoryImpl from '../../../Infrastructure/Repository/CheckoutRepositoryImpl';
import PostGreDataSourceModule from "../ORMModule/PostGreDataSourceModule";
import CheckoutAggregateMapperContext from '../../../Infrastructure/Repository/Mapper/CheckoutAggregateMapperContext';
import WriteCheckoutAggregateMapper from '../../../Infrastructure/Repository/Mapper/WriteCheckoutAggregateMapper';

@Module({
    providers: [{
        provide:"CheckoutRepository",
        useClass: CheckoutRepositoryImpl
    }, {
        provide: CheckoutAggregateMapperContext.name,
        useFactory: () => {
            const context = new CheckoutAggregateMapperContext
            context.setStrategy( new WriteCheckoutAggregateMapper)
            return context;
        }
    }],
    imports: [PostGreDataSourceModule]
})
export default class WriteRepositoryModule {}