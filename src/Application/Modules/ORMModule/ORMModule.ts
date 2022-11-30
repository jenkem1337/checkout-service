import { Module } from "@nestjs/common";
import { ORMProviders } from "./OrmProvider";

@Module({
    providers: [...ORMProviders],
    exports:   [...ORMProviders]
})
export default class ORMModule{}