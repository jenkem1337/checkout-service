import { AsyncLocalStorage } from "async_hooks";
import IEntityManagerFactory from "src/Core/Interfaces/IEntityManagerFactory";
import { DataSource, EntityManager, QueryRunner } from "typeorm";


export default class EntityManagerFactory implements IEntityManagerFactory{
    constructor(
        private readonly dataSource:DataSource,
        private readonly als: AsyncLocalStorage<Map<string, QueryRunner>>
    ){}
    createEntityManager():EntityManager{
        const transactionManager = this.als.getStore().get("QUERY_RUNNER").manager
        return transactionManager
        
    }
}