import { Controller, Inject } from "@nestjs/common";
import {EventPattern} from "@nestjs/microservices"
import CheckoutQueryModel from '../../Core/Models/QueryModels/CheckoutQueryModel';
import ReadCheckoutRepository from "../../Core/Interfaces/CheckoutReadRepository";
@Controller()
export default class CheckoutProjection {

    constructor(
        @Inject("CheckoutReadRepository")
        private readonly chekcoutReadRepository: ReadCheckoutRepository
    ){}
    @EventPattern("checkout_created")
    handleCheckoutCreatedEvent(event:any){
        const checkoutQueryModel = CheckoutQueryModel.valueOf({
            checkoutState: event.checkoutState.state,
            createdDate: event.createdAt,
            customerUuid: event.userUuid.uuid,
            subTotal: event.subTotal.amount,
            updatedDate: event.updatedAt,
            uuid: event.checkoutUuid.uuid,
        })
        this.chekcoutReadRepository.save(checkoutQueryModel)
    }
}