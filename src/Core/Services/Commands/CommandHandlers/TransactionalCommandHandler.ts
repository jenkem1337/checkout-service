import { CommandBus, CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import TransactionalCommand from "../Command/TransactionalCommand";
import { Inject } from "@nestjs/common";
import { DataSource } from "typeorm";
@CommandHandler(TransactionalCommand)
export default class TransactionalCommandHandler implements ICommandHandler<TransactionalCommand<ICommand>> {
    constructor(
        @Inject("DataSource")
        private readonly dataSource: DataSource,
        private readonly commandBus: CommandBus
    ){}
    async execute(command: TransactionalCommand<ICommand>): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            await this.commandBus.execute(command.command)
            await queryRunner.commitTransaction()
            console.log("commitlendi")
        } catch (error) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        } 

    }
    
}