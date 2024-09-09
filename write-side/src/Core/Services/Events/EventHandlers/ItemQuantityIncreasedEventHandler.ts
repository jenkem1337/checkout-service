import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import ItemQuantityIncreased from "src/Core/Models/Domain Models/Checkout/Events/ItemQuantityIncreased";

@EventsHandler(ItemQuantityIncreased)
export default class ItemQuantityIncreasedEventHandler implements IEventHandler<ItemQuantityIncreased> {
    constructor(
        @Inject("CHECKOUT_PROJECTION_SERVICE")
        private readonly client:ClientProxy
    ){}
    handle(event: ItemQuantityIncreased) {
        this.client.emit("item-quantity-increased", event)
    }

}