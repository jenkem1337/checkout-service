import { Module } from "@nestjs/common";
import HandlerModule from "../Handlers/HandlerModule";
import CheckoutProjection from '../../../Infrastructure/Projection/CheckoutProjection';
import CheckoutServiceController from '../../ServiceController/CheckoutServiceController';

@Module({
    imports: [HandlerModule],
    controllers: [CheckoutServiceController,CheckoutProjection]
})
export default class CheckoutMicroserviceModule {}