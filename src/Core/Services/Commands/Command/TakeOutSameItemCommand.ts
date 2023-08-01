import { ICommand } from "@nestjs/cqrs";

export default class TakeOutSameItemsCommand implements ICommand {
    constructor(
        readonly checkoutItemUuid:string,
        readonly checkoutUuid:string,
        readonly customerUuid:string
    ){}
}