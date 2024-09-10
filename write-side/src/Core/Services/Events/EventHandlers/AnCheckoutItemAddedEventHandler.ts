import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ClientKafka, ClientProxy } from "@nestjs/microservices";
import AnItemAdded from "src/Core/Models/Domain Models/Checkout/Events/AnItemAdded";

@EventsHandler(AnItemAdded)
export default class AnCheckoutItemAddedEventHandler implements IEventHandler<AnItemAdded> {
    constructor(
        @Inject("CHECKOUT_PROJECTION_SERVICE")
        private readonly client: ClientKafka
    ){}
    handle(event: AnItemAdded) {
        this.client.emit("an_item_added", JSON.parse(JSON.stringify(event)))
    }

}