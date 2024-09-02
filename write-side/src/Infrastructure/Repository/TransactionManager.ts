import { Inject, Injectable, Scope } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { randomUUID } from "crypto";
import ITransactionManager from "src/Core/Interfaces/ITransactionManager";
import { EventEmitter } from "events";
import { DataSource, QueryRunner } from "typeorm";

@Injectable()
export default class TransactionManager implements ITransactionManager{
    private readonly queryRunner:QueryRunner
    private readonly als: AsyncLocalStorage<Map<string, QueryRunner | string>>
    private hasTransactionDestroyed:boolean = false
    constructor(
        @Inject("DataSource")
        dataSource: DataSource, 
        als: AsyncLocalStorage<Map<string, QueryRunner | string>>
    ){
        this.queryRunner = dataSource.createQueryRunner()
        this.als = als
    }    
    async beginTransaction(){
        if (this.queryRunner.isTransactionActive) return;
        await this.queryRunner.connect()
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