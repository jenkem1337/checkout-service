import { Inject, Injectable } from "@nestjs/common";
import IdempotentMessageRepository from "./IdempotentMessageRepository";
import { Redis } from 'ioredis';

@Injectable()
export default class IdempotentMessageRepositoryImpl implements IdempotentMessageRepository{
    
    constructor(
        @Inject("RedisDataSource")
        private readonly redis:Redis
    ){}
    async setMessageId(id: string): Promise<void> {
        const key = `idempotent-msg-id:${id}`
        await this.redis.set(key, id)
        await this.redis.expire(key, 86400)
    }
    async isMessageExist(id: string): Promise<boolean> {
        const key = `idempotent-msg-id:${id}`
        return await this.redis.get(key) ? true : false
    }

}