import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { randomUUID } from "crypto";

@Injectable()
export default class CheckoutClientService {
    constructor(
        @Inject("CHECKOUT_SERVICE")
        private client:ClientProxy
    ){}

    addAnItemToCheckout(){
        return this.client.send({cmd: "add_an_item"}, {})
    }

    createCheckout(){
        return this.client.send({cmd: "create_checkout"}, randomUUID())
    }
}