import { Module } from "@nestjs/common";
import { mongoORMProvider } from "./OrmProvider";

@Module({
    providers: [...mongoORMProvider],
    exports: [...mongoORMProvider]
})
export default class MongoORMModule {}