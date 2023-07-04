import { ICommand } from "@nestjs/cqrs";

export default class TransactionalCommand<T extends ICommand> implements ICommand {
    constructor(
        public readonly command: T
    ){}
}