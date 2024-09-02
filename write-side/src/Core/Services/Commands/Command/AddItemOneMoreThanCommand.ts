import { ICommand } from '@nestjs/cqrs';
export default class AddItemOneMoreThanCommand implements ICommand {
    constructor(
        public readonly checkoutUuid:string,
        public readonly customerUuid:string,
        public readonly checkoutItemUuid: string,
        public readonly quantity:number,
    ){}
}