import { Module } from "@nestjs/common";
import { Redis } from "ioredis";

@Module({
    providers: [{
        provide:"RedisDataSource",
        useFactory: () => {
            return new Redis(parseInt(process.env.REDIS_PORT,10), process.env.REDIS_HOST)
        }
    }],
    exports: ["RedisDataSource"]
})
export default class RedisModule {}