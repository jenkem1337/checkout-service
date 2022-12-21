import { Module } from "@nestjs/common";
import { postGresProvider } from "./OrmProvider";

@Module({
    providers: [...postGresProvider],
    exports:   [...postGresProvider]
})
export default class PostGreDataSourceModule{}