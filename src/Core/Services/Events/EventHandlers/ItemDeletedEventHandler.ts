import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler, InvalidEventsHandlerException } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import CheckoutRepository from "src/Core/Interfaces/CheckoutRepository";
import ItemDeleted from "src/Core/Models/Domain Models/Checkout/Events/ItemDeleted";

@EventsHandler(ItemDeleted)
export default class ItemDeletedEventHandler implements IEventHandler<ItemDeleted>{
    constructor(
        @Inject("CHECKOUT_PROJECTION_SERVICE")
        private readonly checkoutProjectionClient:ClientProxy,
        @Inject("CheckoutRepository")
        private readonly checkoutRepository:CheckoutRepository
    ){}

    handle(event: ItemDeleted) {
        this.checkoutRepository.removeCheckoutItemByUuid(event.checkoutItemUuid.getUuid())
        this.checkoutProjectionClient.emit("item-deleted", event)
    }
}