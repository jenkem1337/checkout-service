import { Module } from "@nestjs/common";
import CheckoutProjection from "src/Projection/CheckoutProjection";
import CheckoutReadRepositoryImpl from '../Repository/CheckoutReadRepositoryImpl';
import MongoModule from "./MongoModule";
import IdempotentMessageRepositoryImpl from "src/Repository/IdempotentMessageRepositoryImpl";
import RedisModule from "./RedisModule";

@Module({
    controllers: [CheckoutProjection],
    providers:[
        {
            provide: "CheckoutReadRepository",
            useClass: CheckoutReadRepositoryImpl
        },
        {
            provide: "IdempotentMessageRepository",
            useClass: IdempotentMessageRepositoryImpl
        }
    ],
    imports: [MongoModule, RedisModule]
})
export default class ProjectionModule{}