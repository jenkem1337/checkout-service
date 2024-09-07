export default class FindAnCheckoutDto {
    constructor(
        readonly checkoutUuid:string,
        readonly customerUuid: string
    ){}
}