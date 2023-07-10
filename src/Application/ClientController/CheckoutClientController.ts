import { Controller, Delete, Get, Post, Put, Request, UseGuards } from "@nestjs/common";
import CheckoutClientService from "../ClientService/CheckoutClientService";
import { JwtAuthGuard } from "../Auth/JwtAuthGuard";

@Controller("/checkout")
export default class CheckoutClientController {
    constructor(
        private readonly checkoutService:CheckoutClientService,
    ){}
    

    @Post()
    async createCheckout(){
        return this.checkoutService.createCheckout()
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
    //@Post()
    //async createOrder(){}
//
}