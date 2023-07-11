import { IQuery } from "@nestjs/cqrs";

export default class CheckoutByUuidAndCustomerUuidQuery implements IQuery {
    constructor(
        readonly checkoutUuid:string,
        readonly customerUuid:string
    ){}
}