import ITransactionManager from "./ITransactionManager";

export default interface ITransactionManagerFactory {
    createTransactionFactory():Promise<ITransactionManager>
}