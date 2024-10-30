import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ClientKafka } from "@nestjs/microservices";
import CheckoutCompleted from "src/Core/Models/Domain Models/Checkout/Events/CheckoutCompleted";

@EventsHandler(CheckoutCompleted)
export default class CheckoutCompletedEventHandler implements IEventHandler<CheckoutCompleted> {
    constructor(
        @Inject("ORDER_SAGA")
        private readonly sagaClient:ClientKafka,
        @Inject("CHECKOUT_PROJECTION_SERVICE")
        private readonly projectionClient:ClientKafka
    ){}
    
    handle(event: CheckoutCompleted) {
        this.sagaClient.emit(`pay-with-${event.peymentMethod}`, JSON.parse(JSON.stringify(event)))
        this.projectionClient.emit("checkout-completed", JSON.parse(JSON.stringify(event)))
    }
    
}