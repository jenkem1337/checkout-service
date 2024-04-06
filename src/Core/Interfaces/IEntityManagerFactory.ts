import { EntityManager } from "typeorm";

export default interface IEntityManagerFactory{
    createEntityManager():EntityManager
}