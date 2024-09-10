import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ClientKafka, ClientProxy } from "@nestjs/microservices";
import ItemQuantityIncreased from "src/Core/Models/Domain Models/Checkout/Events/ItemQuantityIncreased";

@EventsHandler(ItemQuantityIncreased)
export default class ItemQuantityIncreasedEventHandler implements IEventHandler<ItemQuantityIncreased> {
    constructor(
        @Inject("CHECKOUT_PROJECTION_SERVICE")
        private readonly client:ClientKafka
    ){}
    handle(event: ItemQuantityIncreased) {
        this.client.emit("item-quantity-increased", JSON.parse(JSON.stringify(event)))
    }

}