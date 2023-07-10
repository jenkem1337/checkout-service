import { BadRequestException, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Request, UseGuards } from "@nestjs/common";
import CheckoutClientService from "../ClientService/CheckoutClientService";
import { JwtAuthGuard } from "../Auth/JwtAuthGuard";
import { map, firstValueFrom } from "rxjs";

@Controller("/checkout")
export default class CheckoutClientController {
    constructor(
        private readonly checkoutService:CheckoutClientService,
    ){}
    
    @Post()
    async createCheckout(){
        const result = await firstValueFrom(this.checkoutService.createCheckout()
                        .pipe(
                          map(result => {
                            switch(result.type){
                              case "ERROR": 
                                    throw new BadRequestException({"error_message": result.result});
                              case "SUCCESS": return result.result;
                            }
                          })
                        ))
        return result
    }

    @UseGuards(JwtAuthGuard)
    @Get("/insert-an-item")
    async addAnItemToCheckout(@Request() req){
        this.checkoutService.addAnItemToCheckout()
    }

    //@Post()
    //async addItemOneMoreThan(){}
//
    //@Post()
    //async getCheckoutUuid(){}
//
    //@Get()
    //async getCheckoutByUuid(){}
//
    //@Get()
    //async getCheckoutByUuidAndCustomerUuid(){}
//
    //@Delete()
    //async deleteAnCheckoutItemByUuid(){}  
    //
    //@Delete()
    //async deleteAllSameItemsByUuid(){}
//
    //@Delete()
    //async deleteItemsOneMoreThanByUuid(){}
//

}