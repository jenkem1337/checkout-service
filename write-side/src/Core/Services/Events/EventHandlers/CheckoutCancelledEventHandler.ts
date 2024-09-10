import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import CheckoutCancelled from '../../../Models/Domain Models/Checkout/Events/CheckoutCancelled';
import { Inject } from '@nestjs/common';
import { ClientKafka, ClientProxy } from "@nestjs/microservices";

@EventsHandler(CheckoutCancelled)
export default class CheckoutCancelledEventHandler implements IEventHandler<CheckoutCancelled> {
    constructor(
        @Inject("CHECKOUT_PROJECTION_SERVICE")
        private readonly checkoutProjectionClient:ClientKafka
    ){}
    handle(event: CheckoutCancelled) {
        this.checkoutProjectionClient.emit("checkout_cancelled", JSON.parse(JSON.stringify(event)))
    }
}