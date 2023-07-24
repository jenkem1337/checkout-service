import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import AddAnCheckoutItemDto from "../ClientController/DTOs/AddAnCheckoutItemDto";
import AddOneMoreThanItemDto from "../ClientController/DTOs/AddOneMoreThanItemDto";
import DeleteAnItemDto from "../ClientController/DTOs/DeleteAnItemDto";
import DeleteItemOneMoreThanDto from "../ClientController/DTOs/DeleteItemOneMoreThanDto";

@Injectable()
export default class CheckoutClientService {
    constructor(
        @Inject("CHECKOUT_SERVICE")
        private client:ClientProxy
    ){}

    addAnItemToCheckout(dto: AddAnCheckoutItemDto){
        return this.client.send({cmd: "add_an_item"}, dto)
    }
    addOneMoreThanItemToCheckout(dto:AddOneMoreThanItemDto){
        return this.client.send({cmd: "add_one_more_than_item"}, dto)
    }
    deleteAnItemFromCheckout(dto: DeleteAnItemDto){
        return this.client.send({cmd: "delete-an-item"}, dto)
    }
    deleteItemOneMoreThan(dto: DeleteItemOneMoreThanDto){
        return this.client.send({cmd: "delete-item-one-more-than"}, dto)
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