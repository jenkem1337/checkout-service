import { Module } from "@nestjs/common";
import CheckoutReadRepositoryImpl from "../../../Infrastructure/Repository/CheckoutReadRepositoryImpl";
import MongoModule from "../DatabaseConnectionModule/MongoModule";

@Module({
    providers: [{
        useClass:CheckoutReadRepositoryImpl,
        provide:"CheckoutReadRepository"
    }],
    imports: [MongoModule],
    exports: ["CheckoutReadRepository"]
})
export default class ReadRepositoryModule {}