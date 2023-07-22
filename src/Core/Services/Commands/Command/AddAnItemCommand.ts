import { ICommand } from "@nestjs/cqrs";

export default class AddAnItemCommand implements ICommand {
    constructor(
        public readonly checkoutUuid:string,
        public readonly customerUuid:string,
        public readonly checkoutItemUuid: string,
        public readonly productUuid: string,
        public readonly quantity:number = 1
    ){}
}