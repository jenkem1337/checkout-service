import { Controller } from "@nestjs/common";
import {EventPattern} from "@nestjs/microservices"
import CheckoutCreatedAndOneCheckoutItemAddedEvent from "../../Core/Services/Events/CheckoutCreatedAndOneCheckoutItemAddedEvent";
@Controller()
export default class CheckoutProjection {
    @EventPattern('checkout_created_and_an_item_added')
    async checkoutCreated(event: CheckoutCreatedAndOneCheckoutItemAddedEvent){}
    
}