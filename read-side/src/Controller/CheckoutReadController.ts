import { Controller, Get, Inject, Param, Request, UseGuards } from "@nestjs/common";
import CheckoutService from "src/Service/CheckoutService";
import FindAnCheckoutDto from "./DTO/FindAnCheckoutDto";
import { JwtAuthGuard } from "src/Auth/JwtAuthGuard";

@Controller("/api/v1/checkout")
export default class CheckoutReadController {
    
    constructor(
        @Inject("CheckoutService")
        private readonly checkoutService:CheckoutService
    ){}
    
    @UseGuards(JwtAuthGuard)
    @Get("/:checkout_uuid")
    async getAnCheckoutByUuidAndCustomerUuid(@Request() req:any, @Param("checkout_uuid") checkoutUuid: string){
      return await this.checkoutService.findAnCheckoutByUuidAndCustomerUuid(
        new FindAnCheckoutDto(checkoutUuid, req.user.customerUUID)
      )
    }
}
