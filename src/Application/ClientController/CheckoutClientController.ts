import { Redis } from 'ioredis';
import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import CheckoutClientService from "../ClientService/CheckoutClientService";
import { JwtAuthGuard } from "../Auth/JwtAuthGuard";
import { map, firstValueFrom } from "rxjs";
import RedisPubSub from "src/Infrastructure/Queue/RedisPubSub";
import AddAnCheckoutItemDto from './DTOs/AddAnCheckoutItemDto';
import AddOneMoreThanItemDto from './DTOs/AddOneMoreThanItemDto';
import DeleteAnItemDto from './DTOs/DeleteAnItemDto';
import DeleteItemOneMoreThanDto from './DTOs/DeleteItemOneMoreThanDto';
import { Not } from 'typeorm';
import DeleteSameItemsDto from './DTOs/DeleteSameItems';

@Controller("/checkout")
export default class CheckoutClientController {
    constructor(
        private readonly checkoutService:CheckoutClientService,
    ){}
    
    @UseGuards(JwtAuthGuard)
    @Post()
    async createCheckout(@Request() req:any){
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
    async addAnItemToCheckout(@Request() req:any, @Body() dto: AddAnCheckoutItemDto){
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
    
    @UseGuards(JwtAuthGuard)
    @Post("/items")
    async addItemOneMoreThanToCheckout(@Body() dto: AddOneMoreThanItemDto, @Request() req:any){
      dto.customerUuid = req.user.customerUUID
      return await firstValueFrom(this.checkoutService.addOneMoreThanItemToCheckout(dto)
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
    @Get("/:checkout_uuid")
    async getAnCheckoutByUuidAndCustomerUuid(@Request() req:any, @Param("checkout_uuid") checkoutUuid: string){
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
    async cancelCheckout(@Request() req:any, @Param("checkout_uuid") checkoutUuid:string){
      return await firstValueFrom(this.checkoutService.cancelCheckout(checkoutUuid, req.user.customerUUID as string)
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
    @Delete("/item")
    async deleteAnItemFromCheckout(@Body() dto: DeleteAnItemDto, @Request() req:any){
      dto.customerUuid = req.user.customerUUID
      return await firstValueFrom(this.checkoutService.deleteAnItemFromCheckout(dto)
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
    @Delete("/same-items")
    async deleteAllSameItemsFromCheckoutByUuid(@Body() dto:DeleteSameItemsDto, @Request() req:any){
      dto.customerUuid = req.user.customerUUID
      return await firstValueFrom(this.checkoutService.deleteSameItems(dto)
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
    @Delete("/items")
    async deleteItemsOneMoreThanFromCheckoutByUuid(@Body() dto: DeleteItemOneMoreThanDto, @Request() req:any){
      dto.customerUuid = req.user.customerUUID
      return await firstValueFrom(this.checkoutService.deleteItemOneMoreThan(dto)
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

}