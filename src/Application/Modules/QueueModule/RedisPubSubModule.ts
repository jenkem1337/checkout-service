import { Redis } from 'ioredis';
import { Module } from "@nestjs/common";
import RedisPubSub from "../../../Infrastructure/Queue/RedisPubSub";
import MessageQueue from '../../../Core/Interfaces/MessageQueue';

@Module({
    providers: [{
        provide:"MessageQueue",
        useFactory: (): MessageQueue => {
            return new RedisPubSub(
                new Redis()
            )
        }
    }],
    exports: ["MessageQueue"]
})
export default class RedisPubSubModule{}