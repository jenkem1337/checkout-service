import { CommandBus, CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import TransactionalCommand from "../Command/TransactionalCommand";
import { Inject } from "@nestjs/common";
import { DataSource } from "typeorm";
import Result from '../../../Models/Result/Result';
import ErrorResult from '../../../Models/Result/ErrorResult';
import NullableResult from '../../../Models/Result/NullableResult';
@CommandHandler(TransactionalCommand)
export default class TransactionalCommandHandler implements ICommandHandler<TransactionalCommand<ICommand>, Result<any>> {
    constructor(
        @Inject("DataSource")
        private readonly dataSource: DataSource,
        private readonly commandBus: CommandBus
    ){}
    async execute(command: TransactionalCommand<ICommand>): Promise<Result<any>> {
        const queryRunner = this.dataSource.createQueryRunner()
        let result: Result<any> = new NullableResult()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()    
            result = await this.commandBus.execute(command.command)
            await queryRunner.commitTransaction()
            console.log("commitlendi")
        } catch (error) {
            await queryRunner.rollbackTransaction()
            result = new ErrorResult(error.message)
        } finally {
            await queryRunner.release()
        } 
        return result
    }
    
}