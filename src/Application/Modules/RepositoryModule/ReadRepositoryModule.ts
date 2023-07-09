import { Module } from "@nestjs/common";
import MongoORMModule from '../ORMModule/MongoOrmModule';
import CheckoutReadRepositoryImpl from "../../../Infrastructure/Repository/CheckoutReadRepositoryImpl";

@Module({
    providers: [{
        useClass:CheckoutReadRepositoryImpl,
        provide:"CheckoutReadRepository"
    }],
    imports: [MongoORMModule],
    exports: ["CheckoutReadRepository"]
})
export default class ReadRepositoryModule {}