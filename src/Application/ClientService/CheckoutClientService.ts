import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import AddAnCheckoutItemDto from "../ClientController/DTOs/AddAnCheckoutItemDto";

@Injectable()
export default class CheckoutClientService {
    constructor(
        @Inject("CHECKOUT_SERVICE")
        private client:ClientProxy
    ){}

    addAnItemToCheckout(dto: AddAnCheckoutItemDto){
        return this.client.send({cmd: "add_an_item"}, dto)
    }

    createCheckout(customerUuid:string){
        return this.client.send({cmd: "create_checkout"}, customerUuid)
    }

    findAnCheckoutByUuidAndCustomerUuid(checkoutUuid:string, customerUuid:string){
        const payload = {checkoutUuid, customerUuid}
        return this.client.send({cmd: "find_an_checkout_by_uuid_and_customer_uuid"}, payload)
    }

    cancelCheckout(checkoutUuid:string, customerUuid:string){
        const payload = {checkoutUuid, customerUuid}
        return this.client.send({cmd: "cancel_checkout"}, payload)
    }
}