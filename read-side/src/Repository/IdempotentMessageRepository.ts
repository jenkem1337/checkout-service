export default interface IdempotentMessageRepository {
    setMessageId(id:string):Promise<void>
    isMessageExist(id:string):Promise<boolean>
}