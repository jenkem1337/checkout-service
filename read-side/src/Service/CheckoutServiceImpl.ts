import { Injectable } from "@nestjs/common";
import CheckoutService from "./CheckoutService";

@Injectable()
export default class CheckoutServiceImpl implements CheckoutService {
    
    
    findAnCheckoutByUuidAndCustomerUuid(checkoutUuid: string, customerUuid: string) {
        return `checkout-uuid -> ${checkoutUuid} ${process.env.HELLO}` 
    }

}