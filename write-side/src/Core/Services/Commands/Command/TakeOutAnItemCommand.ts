import { ICommand } from "@nestjs/cqrs";

export default class TakeOutAnItemCommand implements ICommand {
    constructor(
        readonly checkoutUuid:string,
        readonly checkoutItemUuid:string,
        readonly customerUuid:string
    ){}
}