import { Controller, Delete, Get, Post, Put } from "@nestjs/common";
import CheckoutClientService from "../ClientService/CheckoutClientService";

@Controller("/checkout")
export default class CheckoutClientController {
    constructor(private readonly checkoutService:CheckoutClientService){}
    @Post("/insert-an-item")
    async addAnItemToCheckout(){
        return this.checkoutService.addAnItemToCheckout()
    }

    @Post()
    async addItemOneMoreThan(){}

    @Post()
    async getCheckoutUuidOrCreateCheckout(){}

    @Get()
    async getCheckoutByUuid(){}

    @Get()
    async getCheckoutByUuidAndCustomerUuid(){}

    @Delete()
    async deleteAnCheckoutItemByUuid(){}  
    
    @Delete()
    async deleteAllSameItemsByUuid(){}

    @Delete()
    async deleteItemsOneMoreThanByUuid(){}

    @Post()
    async createOrder(){}

}