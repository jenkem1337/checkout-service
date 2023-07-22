export default interface MessageQueue {
    subscribe(...queueNames:string[]):Promise<void>
    publishMessage(queueName:string, message: string | Buffer):Promise<void>
    getResponseFromQueue<T>(queueName:string):Promise<T>
}