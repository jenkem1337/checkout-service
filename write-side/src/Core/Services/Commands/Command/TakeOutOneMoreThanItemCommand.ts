import { ICommand } from "@nestjs/cqrs";

export default class TakeOutOneMoreThanItemCommand implements ICommand {
    constructor(
        readonly checkoutUuid:string,
        readonly checkoutItemUuid:string,
        readonly customerUuid:string,
        readonly quantity:number
    ){}
}