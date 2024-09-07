import { Controller, Get, Inject, Param, Request } from "@nestjs/common";
import CheckoutService from "src/Service/CheckoutService";

@Controller("/api/v1/checkout")
export default class CheckoutReadController {
    
    constructor(
        @Inject("CheckoutService")
        private readonly checkoutService:CheckoutService
    ){}
    
    @Get("/:checkout_uuid")
    async getAnCheckoutByUuidAndCustomerUuid(@Request() req:any, @Param("checkout_uuid") checkoutUuid: string){
      return await this.checkoutService.findAnCheckoutByUuidAndCustomerUuid(checkoutUuid, "lala")
    }
}
