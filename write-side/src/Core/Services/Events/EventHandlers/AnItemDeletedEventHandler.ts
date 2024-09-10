import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ClientKafka, ClientProxy } from "@nestjs/microservices";
import AnItemDeleted from "src/Core/Models/Domain Models/Checkout/Events/AnItemDeleted";

@EventsHandler(AnItemDeleted)
export default class AnItemDeletedEventHandler implements IEventHandler<AnItemDeleted>{
    constructor(
        @Inject("CHECKOUT_PROJECTION_SERVICE")
        private readonly checkoutProjectionClient: ClientKafka
    ){}

    handle(event: AnItemDeleted) {
        this.checkoutProjectionClient.emit("an-item-deleted", JSON.parse(JSON.stringify(event)))
    }
}