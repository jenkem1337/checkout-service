import { Module } from "@nestjs/common";
import CheckoutProjection from "src/Projection/CheckoutProjection";
import CheckoutReadRepositoryImpl from '../Repository/CheckoutReadRepositoryImpl';
import MongoModule from "./MongoModule";

@Module({
    controllers: [CheckoutProjection],
    providers:[{
        provide: "CheckoutReadRepository",
        useClass: CheckoutReadRepositoryImpl
    }],
    imports: [MongoModule]
})
export default class ProjectionModule{}