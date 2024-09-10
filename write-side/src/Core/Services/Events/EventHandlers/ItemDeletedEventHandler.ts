import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler, InvalidEventsHandlerException } from "@nestjs/cqrs";
import { ClientKafka, ClientProxy } from "@nestjs/microservices";
import ICheckoutRepositoryFactory from "src/Core/Interfaces/ICheckoutRepositoryFactory";
import ItemDeleted from "src/Core/Models/Domain Models/Checkout/Events/ItemDeleted";

@EventsHandler(ItemDeleted)
export default class ItemDeletedEventHandler implements IEventHandler<ItemDeleted>{
    constructor(
        @Inject("CHECKOUT_PROJECTION_SERVICE")
        private readonly checkoutProjectionClient:ClientKafka,
    ){}

    handle(event: ItemDeleted) {
        this.checkoutProjectionClient.emit("item-deleted", JSON.parse(JSON.stringify(event)))
    }
}