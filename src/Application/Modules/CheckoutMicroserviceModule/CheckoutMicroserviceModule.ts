import { Module } from "@nestjs/common";
import HandlerModule from "../Handlers/HandlerModule";
import CheckoutProjection from '../../../Infrastructure/Projection/CheckoutProjection';

@Module({
    imports: [HandlerModule],
    controllers: [CheckoutProjection]
})
export default class CheckoutMicroserviceModule {}