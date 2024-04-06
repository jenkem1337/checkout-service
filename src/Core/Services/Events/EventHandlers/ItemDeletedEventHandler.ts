import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler, InvalidEventsHandlerException } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import ICheckoutRepositoryFactory from "src/Core/Interfaces/ICheckoutRepositoryFactory";
import ItemDeleted from "src/Core/Models/Domain Models/Checkout/Events/ItemDeleted";

@EventsHandler(ItemDeleted)
export default class ItemDeletedEventHandler implements IEventHandler<ItemDeleted>{
    constructor(
        @Inject("CHECKOUT_PROJECTION_SERVICE")
        private readonly checkoutProjectionClient:ClientProxy,
        @Inject("CheckoutRepositoryFactory")
        private readonly checkoutRepository:ICheckoutRepositoryFactory
    ){}

    handle(event: ItemDeleted) {
        this.checkoutRepository.createCheckoutRepository().removeCheckoutItemByUuid(event.checkoutItemUuid.getUuid())
        this.checkoutProjectionClient.emit("item-deleted", event)
    }
}