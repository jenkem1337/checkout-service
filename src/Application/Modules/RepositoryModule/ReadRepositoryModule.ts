import { Module } from "@nestjs/common";
import CheckoutReadRepositoryImpl from "../../../Infrastructure/Repository/CheckoutReadRepositoryImpl";
import MongoModule from "../ORMModule/MongoModule";

@Module({
    providers: [{
        useClass:CheckoutReadRepositoryImpl,
        provide:"CheckoutReadRepository"
    }],
    imports: [MongoModule],
    exports: ["CheckoutReadRepository"]
})
export default class ReadRepositoryModule {}