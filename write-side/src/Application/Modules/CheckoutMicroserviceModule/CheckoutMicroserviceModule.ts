import { Module } from "@nestjs/common";
import HandlerModule from "../Handlers/HandlerModule";
import CheckoutProjection from '../../../Infrastructure/Projection/CheckoutProjection';
import CheckoutServiceController from '../../ServiceController/CheckoutServiceController';
import { CqrsModule } from "@nestjs/cqrs";
import ReadRepositoryModule from "../RepositoryModule/ReadRepositoryModule";

@Module({
    imports: [HandlerModule, CqrsModule, ReadRepositoryModule],
    controllers: [CheckoutServiceController,CheckoutProjection]
})
export default class CheckoutMicroserviceModule {}