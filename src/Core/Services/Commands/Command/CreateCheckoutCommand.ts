import { ICommand } from "@nestjs/cqrs";

export default class CreateCheckoutCommand implements ICommand {
    constructor(
        public readonly customerUuid:string
    ){}
}