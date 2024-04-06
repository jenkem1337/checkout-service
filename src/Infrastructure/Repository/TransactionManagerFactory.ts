import ITransactionManager from "src/Core/Interfaces/ITransactionManager";
import ITransactionManagerFactory from "src/Core/Interfaces/ITransactionManagerFactory";
import TransactionManager from "./TransactionManager";
import { DataSource, QueryRunner } from 'typeorm';
import { ClsService } from "nestjs-cls";
import { AsyncLocalStorage } from "async_hooks";

export default class TransactionManagerFactory implements ITransactionManagerFactory{
    
    constructor(
        private readonly dataSource:DataSource,
        private readonly als: AsyncLocalStorage<Map<string, QueryRunner>>
    ){}
    async createTransactionFactory(): Promise<ITransactionManager> {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        return new TransactionManager(queryRunner, this.als)
    }
    
}