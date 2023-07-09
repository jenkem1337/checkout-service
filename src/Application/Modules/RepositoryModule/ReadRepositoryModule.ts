import { Module } from "@nestjs/common";
import MongoORMModule from '../ORMModule/MongoOrmModule';
import CheckoutReadRepositoryImpl from "../../../Infrastructure/Repository/CheckoutReadRepositoryImpl";

@Module({
    providers: [{
        useClass:CheckoutReadRepositoryImpl,
        provide:"ReadCheckoutRepository"
    }],
    imports: [MongoORMModule],
    exports: ["ReadCheckoutReposityory"]
})
export default class ReadRepositoryModule {}