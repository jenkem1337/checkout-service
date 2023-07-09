import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export default class CheckoutServiceController {
    @MessagePattern({cmd: "add_an_item"})
    zort(){
        return {message:"item added"}
    }
}