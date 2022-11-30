import { ICommand } from '@nestjs/cqrs';
export default class AddItemOneMoreThanCommand implements ICommand {
    constructor(
        public readonly checkoutUuid:string,
        public readonly customerUuid:string,
        public readonly checkoutItemUuid: string,
        public readonly productUuid: string,
        public readonly productHeader: string,
        public readonly productBasePrice: number,
        public readonly quantity:number,
        public readonly itemUpdatedDate: Date,
    ){}
}