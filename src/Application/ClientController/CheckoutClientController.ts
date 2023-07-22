import { Redis } from 'ioredis';
import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import CheckoutClientService from "../ClientService/CheckoutClientService";
import { JwtAuthGuard } from "../Auth/JwtAuthGuard";
import { map, firstValueFrom } from "rxjs";
import RedisPubSub from "src/Infrastructure/Queue/RedisPubSub";
import AddAnCheckoutItemDto from './DTOs/AddAnCheckoutItemDto';

@Controller("/checkout")
export default class CheckoutClientController {
    constructor(
        private readonly checkoutService:CheckoutClientService,
    ){}
    
    @UseGuards(JwtAuthGuard)
    @Post()
    async createCheckout(@Request() req){
        return await firstValueFrom(this.checkoutService.createCheckout(req.user.customerUUID as string)
                        .pipe(
                          map(result => {
                            switch(result.type){
                              case "ERROR": 
                                    throw new BadRequestException({"error_message": result.result});
                              case "SUCCESS": 
                                    return result.result;
                            }
                          })
                        ))
    }

    @UseGuards(JwtAuthGuard)
    @Post("/item")
    async addAnItemToCheckout(@Request() req,@Body() dto: AddAnCheckoutItemDto){
      dto.customerUuid = req.user.customerUUID
      return await firstValueFrom(this.checkoutService.addAnItemToCheckout(dto)
      .pipe(
        map(result => {
          switch(result.type){
            case "ERROR": 
                  throw new BadRequestException({"error_message": result.result});
            case "SUCCESS": 
                  return result.result;
          }
        })
      ))
}

    //@Post("/items")
    //async addItemOneMoreThanToCheckout(){}

    @UseGuards(JwtAuthGuard)
    @Get("/:checkout_uuid")
    async getAnCheckoutByUuidAndCustomerUuid(@Request() req, @Param("checkout_uuid") checkoutUuid: string){
      return await firstValueFrom(this.checkoutService.findAnCheckoutByUuidAndCustomerUuid(checkoutUuid, req.user.customerUUID as string)
                        .pipe(
                          map(result => {
                            switch(result.type){
                              case "ERROR": 
                                    throw new NotFoundException({"error_message": result.result});
                              case "SUCCESS": 
                                    return result.result;
                            }
                          })
                        ))

    }
    @UseGuards(JwtAuthGuard)
    @Post("/cancel/:checkout_uuid")
    async cancelCheckout(@Request() req, @Param("checkout_uuid") checkoutUuid:string){
      return await firstValueFrom(this.checkoutService.cancelCheckout(checkoutUuid, req.user.customerUUID as string)
      .pipe(
        map(result => {
          switch(result.type){
            case "ERROR": 
                  throw new BadRequestException({"error_message": result.result});
            case "SUCCESS": 
                  return result.result;
          }
        })
      ))

    }
//
    //@Delete("/item/:item_uuid/:checkout_uuid")
    //async deleteAnItemFromCheckoutByUuid(){}  
    //
    //@Delete("/same-items")
    //async deleteAllSameItemsFromCheckoutByUuid(){}
//
    //@Delete("/items")
    //async deleteItemsOneMoreThanFromCheckoutByUuid(){}
//

}