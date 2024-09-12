import { Controller, Get, Inject, NotFoundException, Param, Request, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import CheckoutService from "src/Service/CheckoutService";
import FindAnCheckoutDto from "./DTO/FindAnCheckoutDto";
import { JwtAuthGuard } from "src/Auth/JwtAuthGuard";
import { catchError, from, throwError } from "rxjs";
import NotFoundBaseExceptionFilter from "./ExceptionFilter/NotFoundExceptionFilter";

@Controller("/api/v1/checkout")
@UseFilters(NotFoundBaseExceptionFilter)
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
