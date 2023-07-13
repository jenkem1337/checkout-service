import { ICommand } from "@nestjs/cqrs";

export default class CancelCheckoutCommand implements ICommand {
    constructor(
        public readonly checkoutUuid:string,
        public readonly customerUuid:string
    ){}
}