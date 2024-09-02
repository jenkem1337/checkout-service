import { Redis } from "ioredis";
import MessageQueue from "../../Core/Interfaces/MessageQueue";
export default class RedisPubSub implements MessageQueue {

    constructor(
        private readonly redisClient: Redis
    ){}

    async subscribe(channel: string): Promise<void> {
        await this.redisClient.subscribe(channel)
    }
    async publishMessage(channel: string, message: string | Buffer): Promise<void> {
        await this.redisClient.publish(channel, message)
    }
    async getResponseFromQueue<T>(channel: string): Promise<T> {
        await this.subscribe(channel)
        return new Promise<string>((resolve, reject) => {
            this.redisClient.on('message', async (subscribedChannel, message) => {
                if (subscribedChannel === channel) {
                  await this.redisClient.unsubscribe(channel)  
                  resolve(JSON.parse(message));
                }
              });
          
        }) as Promise<T>
    }

}