import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Request, Scope, UseFilters, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../Auth/JwtAuthGuard";
import AddAnCheckoutItemDto from './DTOs/AddAnCheckoutItemDto';
import AddOneMoreThanItemDto from './DTOs/AddOneMoreThanItemDto';
import DeleteAnItemDto from './DTOs/DeleteAnItemDto';
import DeleteItemOneMoreThanDto from './DTOs/DeleteItemOneMoreThanDto';
import DeleteSameItemsDto from './DTOs/DeleteSameItems';
import CheckoutService from '../Service/CheckoutService';
import NotFoundBaseExceptionFilter from "../ExcepitonFilters/NotFoundExceptionFilter";
import InvalidOperationExceptionFilter from "../ExcepitonFilters/InvalidOperationExceptionFilter";
import CompleteCheckoutDto from "./DTOs/CompleteCheckoutDto";

@Controller("/api/v1/checkout")
@UseFilters(NotFoundBaseExceptionFilter, InvalidOperationExceptionFilter)
export default class CheckoutController {
    constructor(
        private readonly checkoutService:CheckoutService,
    ){}
    
    @UseGuards(JwtAuthGuard)
    @Post()
    async createCheckout(@Request() req:any){
        return await this.checkoutService.createCheckout(req.user.customerUUID as string)
    }

    @UseGuards(JwtAuthGuard)
    @Post("/item")
    async addAnItemToCheckout(@Request() req:any, @Body() dto: AddAnCheckoutItemDto){
      dto.customerUuid = req.user.customerUUID
      return await this.checkoutService.addAnItemToCheckout(dto)
}
    
    @UseGuards(JwtAuthGuard)
    @Post("/items")
    async addItemOneMoreThanToCheckout(@Body() dto: AddOneMoreThanItemDto, @Request() req:any){
      dto.customerUuid = req.user.customerUUID
      return await this.checkoutService.addOneMoreThanItemToCheckout(dto)

    }

    @UseGuards(JwtAuthGuard)
    @Post("/cancel/:checkout_uuid")
    async cancelCheckout(@Request() req:any, @Param("checkout_uuid") checkoutUuid:string){
      return await this.checkoutService.cancelCheckout(checkoutUuid, req.user.customerUUID as string)


    }
    @UseGuards(JwtAuthGuard)
    @Delete("/item")
    async deleteAnItemFromCheckout(@Body() dto: DeleteAnItemDto, @Request() req:any){
      dto.customerUuid = req.user.customerUUID
      return await this.checkoutService.deleteAnItemFromCheckout(dto)

    }  
    
    @UseGuards(JwtAuthGuard)
    @Delete("/same-items")
    async deleteAllSameItemsFromCheckoutByUuid(@Body() dto:DeleteSameItemsDto, @Request() req:any){
      dto.customerUuid = req.user.customerUUID
      return await this.checkoutService.deleteSameItems(dto)

    }

    @UseGuards(JwtAuthGuard)
    @Delete("/items")
    async deleteItemsOneMoreThanFromCheckoutByUuid(@Body() dto: DeleteItemOneMoreThanDto, @Request() req:any){
      dto.customerUuid = req.user.customerUUID
      return await this.checkoutService.deleteItemOneMoreThan(dto)

    }

    @UseGuards(JwtAuthGuard)
    @Post("/complete")
    async completeCheckout(@Body() dto: CompleteCheckoutDto, @Request() req:any) {
      dto.userUuid = req.user.CustomerID
      return await this.checkoutService.completeCheckout(dto)
    }

}