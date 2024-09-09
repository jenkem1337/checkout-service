import { Inject, Injectable } from "@nestjs/common";
import CheckoutService from "./CheckoutService";
import CheckoutNotFound from '../Exceptions/CheckoutNotFound';
import FindAnCheckoutDto from "src/Controller/DTO/FindAnCheckoutDto";
import QueryableCheckoutReadRepository from "src/Repository/QueryableCheckoutReadRepository";

@Injectable()
export default class CheckoutServiceImpl implements CheckoutService {
    
    constructor(
        @Inject("CheckoutReadRepository")
        private readonly checkoutReadRepository: QueryableCheckoutReadRepository
    ){}
    
    async findAnCheckoutByUuidAndCustomerUuid(dto: FindAnCheckoutDto) {
        const checkoutQueryModel = await this.checkoutReadRepository.findOneByUuidAndCustomerUuid(dto.checkoutUuid, dto.customerUuid)
        if(checkoutQueryModel.isNull()) {
            throw new CheckoutNotFound()
        }
        return checkoutQueryModel
    }

}