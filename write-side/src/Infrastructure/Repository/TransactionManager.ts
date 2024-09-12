import { Inject, Injectable, Scope } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { randomUUID } from "crypto";
import ITransactionManager from "src/Core/Interfaces/ITransactionManager";
import { EventEmitter } from "events";
import { DataSource, QueryRunner } from "typeorm";

@Injectable()
export default class TransactionManager implements ITransactionManager{
    private queryRunner: QueryRunner
    constructor(
        @Inject("DataSource")
        private readonly dataSource: DataSource, 
        private readonly als: AsyncLocalStorage<Map<string, QueryRunner | string>>
    ){
    }    
    async beginTransaction(){
        this.queryRunner = this.dataSource.createQueryRunner()

        if (this.queryRunner.isTransactionActive) return;
        await this.queryRunner.connect()
        await this.queryRunner.startTransaction()
        this.als.getStore().set("QUERY_RUNNER", this.queryRunner)
    }
    async commitTransaction(){
        await this.queryRunner.commitTransaction()
        await this.queryRunner.release()
    }
    async rollbackTransaction(){
        await this.queryRunner.rollbackTransaction()
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
            console.log("Transaction has been rollbacked")
            console.log("Error Message: "+ error.message)
            throw error
        } 
    }
}