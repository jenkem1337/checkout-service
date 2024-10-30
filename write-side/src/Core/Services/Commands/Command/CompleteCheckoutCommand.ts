import { ICommand } from '@nestjs/cqrs';
interface CreditCart {
    number:number
    expirationDate:string
    cvc:string
    owner:string
}
interface IBAN {
    no:string
}

interface OrderAddress {
    name:string
    surname:string
    title:string
    address:string
    city:string
    district:string
    postalCode:string
    country:string
    phoneNumber:string
    eMail:string
}

export default class CompleteCheckoutCommand implements ICommand {
    constructor(
        readonly userUuid:string,
        readonly checkoutUuid:string,
        readonly peymentMethod:string,
        readonly peymentDetail: CreditCart | IBAN,
        readonly orderAddress:OrderAddress,
    ){}
}