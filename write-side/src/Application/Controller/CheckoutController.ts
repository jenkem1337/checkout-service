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
    @Post("/item/:checkoutUuid")
    async addAnItemToCheckout(@Request() req:any, @Param("checkoutUuid") checkoutUuid:any, @Body() dto: AddAnCheckoutItemDto){
      dto.customerUuid = req.user.customerUUID
      dto.checkoutUuid = checkoutUuid
      return await this.checkoutService.addAnItemToCheckout(dto)
}
    
    @UseGuards(JwtAuthGuard)
    @Post("/items/:checkoutUuid")
    async addItemOneMoreThanToCheckout(@Body() dto: AddOneMoreThanItemDto,@Param("checkoutUuid") checkoutUuid:any, @Request() req:any){
      dto.customerUuid = req.user.customerUUID
      dto.checkoutUuid = checkoutUuid
      return await this.checkoutService.addOneMoreThanItemToCheckout(dto)

    }

    @UseGuards(JwtAuthGuard)
    @Post("/cancel/:checkout_uuid")
    async cancelCheckout(@Request() req:any, @Param("checkout_uuid") checkoutUuid:string){
      return await this.checkoutService.cancelCheckout(checkoutUuid, req.user.customerUUID as string)


    }
    @UseGuards(JwtAuthGuard)
    @Delete("/item/:checkoutUuid")
    async deleteAnItemFromCheckout(@Body() dto: DeleteAnItemDto, @Param("checkoutUuid") checkoutUuid:any,@Request() req:any){
      dto.customerUuid = req.user.customerUUID
      dto.checkoutUuid = checkoutUuid
      return await this.checkoutService.deleteAnItemFromCheckout(dto)

    }  
    
    @UseGuards(JwtAuthGuard)
    @Delete("/same-items/:checkoutUuid")
    async deleteAllSameItemsFromCheckoutByUuid(@Body() dto:DeleteSameItemsDto, @Param("checkoutUuid") checkoutUuid:any,@Request() req:any){
      dto.customerUuid = req.user.customerUUID
      dto.checkoutUuid = checkoutUuid
      return await this.checkoutService.deleteSameItems(dto)

    }

    @UseGuards(JwtAuthGuard)
    @Delete("/items/:checkoutUuid")
    async deleteItemsOneMoreThanFromCheckoutByUuid(@Body() dto: DeleteItemOneMoreThanDto, @Param("checkoutUuid") checkoutUuid:any, @Request() req:any){
      dto.customerUuid = req.user.customerUUID
      dto.checkoutUuid = checkoutUuid
      return await this.checkoutService.deleteItemOneMoreThan(dto)

    }

    @UseGuards(JwtAuthGuard)
    @Post("/complete/:checkoutUuid")
    async completeCheckout(@Body() dto: CompleteCheckoutDto, @Param("checkoutUuid") checkoutUuid:any, @Request() req:any) {
      dto.userUuid = req.user.CustomerID
      dto.checkoutUuid = checkoutUuid
      return await this.checkoutService.completeCheckout(dto)
    }

}