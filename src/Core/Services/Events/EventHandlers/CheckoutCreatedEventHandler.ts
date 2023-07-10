import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import CheckoutCreated from '../../../Models/Domain Models/Checkout/Events/CheckoutCreated';
import { ClientProxy } from "@nestjs/microservices";
import { Inject } from "@nestjs/common";

@EventsHandler(CheckoutCreated)
export default class CheckoutCreatedEventHandler implements IEventHandler<CheckoutCreated> {
    
    constructor(
        @Inject("CHECKOUT_PROJECTION_SERVICE")
        private readonly checkoutProjectionClient: ClientProxy
    ){}
    handle(event: CheckoutCreated) {
        this.checkoutProjectionClient.emit("checkout_created", event)
    }

}