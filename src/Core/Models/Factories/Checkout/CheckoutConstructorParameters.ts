import CheckoutItemInterface from "../../Domain Models/Checkout/CheckoutItemInterface"

export default interface CheckoutConstructorParamaters {
    checkoutUuid:string
    userUuid:string
    subTotal:number
    checkoutState:string
    shippingPrice?:number
    peymentMethod?:string
    checkoutItems?: Map<string, CheckoutItemInterface>
    addressName?:string,
    addressOwnerName?:string,
    addressOwnerSurname?:string,
    fullAddressInformation?:string,
    addressCountry?:string,
    addressProvince?:string,
    addressDistrict?:string,
    addressZipCode?:string
    createdAt:Date
    updatedAt:Date

}
