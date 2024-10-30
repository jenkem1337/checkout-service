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

export default class CompleteCheckoutDto {
    userUuid:string
    checkoutUuid:string
    peymentMethod:string
    peymentDetail: CreditCart | IBAN
    orderAddress:OrderAddress
}