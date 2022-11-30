import { Module } from "@nestjs/common";
import CheckoutRepositoryImpl from '../../../Infrastructure/Repository/CheckoutRepositoryImpl';
import ORMModule from "../ORMModule/ORMModule";
import InMemoryCheckoutRepositoryImpl from '../../../Infrastructure/Repository/InMemoryCheckoutRepositoryImpl';

@Module({
    providers: [{
        provide:"CheckoutRepository",
        useClass: CheckoutRepositoryImpl
    }],
    imports: [ORMModule]
})
export default class WriteRepositoryModule {}