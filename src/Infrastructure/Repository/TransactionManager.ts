import { AsyncLocalStorage } from "async_hooks";
import { ClsService } from "nestjs-cls";
import ITransactionManager from "src/Core/Interfaces/ITransactionManager";
import { DataSource, QueryRunner } from "typeorm";

export default class TransactionManager implements ITransactionManager{
    private readonly queryRunner:QueryRunner
    private readonly als: AsyncLocalStorage<Map<string, QueryRunner>>
    private hasTransactionDestroyed:boolean = false
    constructor(queryRunner: QueryRunner, als: AsyncLocalStorage<Map<string, QueryRunner>>){
        this.queryRunner = queryRunner
        this.als = als
    }
    async beginTransaction(){
        if (this.queryRunner.isTransactionActive) return;
        await this.queryRunner.startTransaction()
        this.als.getStore().set("QUERY_RUNNER", this.queryRunner)
    }
    async commitTransaction(){
        if(this.hasTransactionDestroyed) return
        await this.queryRunner.commitTransaction()
    }
    async rollbackTransaction(){
        if(this.hasTransactionDestroyed) return
        await this.queryRunner.rollbackTransaction()
    }
    async releaseConnection(){
        this.hasTransactionDestroyed = true
        await this.queryRunner.release()
    }
    async startTransaction(callback: () => Promise<any>){
        try {
            await this.beginTransaction()
            const response = await callback()
            await this.commitTransaction()
            return response
        } catch (error) {
            await this.rollbackTransaction()
            throw error
        } finally {
            await this.releaseConnection()
        }
    }
}