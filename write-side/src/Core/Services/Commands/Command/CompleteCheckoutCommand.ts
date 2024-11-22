import { ICommand } from '@nestjs/cqrs';


export default class CompleteCheckoutCommand implements ICommand {
    constructor(
        readonly userUuid:string,
        readonly checkoutUuid:string,
    ){}
}