export default interface ITransactionManager {
    beginTransaction():Promise<void>
    commitTransaction():Promise<void>
    rollbackTransaction():Promise<void>
    startTransaction(cb: () => any): Promise<any>
}