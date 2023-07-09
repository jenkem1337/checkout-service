import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export default class CheckoutClientService {
    constructor(
        @Inject("CHECKOUT_SERVICE")
        private client:ClientProxy
    ){}

    addAnItemToCheckout(){
        return this.client.send({cmd: "add_an_item"}, {})
    }
}