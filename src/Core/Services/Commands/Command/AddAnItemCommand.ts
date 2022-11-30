import { ICommand } from "@nestjs/cqrs";

export default class AddAnItemCommand implements ICommand {
    constructor(
        public readonly checkoutUuid:string,
        public readonly customerUuid:string,
        public readonly checkoutItemUuid: string,
        public readonly productUuid: string,
        public readonly productHeader: string,
        public readonly productBasePrice: number,
        public readonly itemCreatedDate: Date,
        public readonly itemUpdatedDate: Date,
        public readonly quantity:number = 1
    ){}
}