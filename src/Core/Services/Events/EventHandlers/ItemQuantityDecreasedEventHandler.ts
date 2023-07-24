import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import ItemDeletedAsQuantity from "src/Core/Models/Domain Models/Checkout/Events/ItemDeletedAsQuantity";

@EventsHandler(ItemDeletedAsQuantity)
export default class ItemQuantityDecreasedEventHandler implements IEventHandler<ItemDeletedAsQuantity> {
    constructor(
        @Inject("CHECKOUT_PROJECTION_SERVICE")
        private readonly client:ClientProxy
    ){}

    handle(event: ItemDeletedAsQuantity) {
        this.client.emit("item-quantity-decreased", event)
    }

}