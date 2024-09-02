export default interface ITransactionManager {
    beginTransaction():Promise<void>
    commitTransaction():Promise<void>
    rollbackTransaction():Promise<void>
    releaseConnection():Promise<void>
    startTransaction(cb: () => any): Promise<any>
}