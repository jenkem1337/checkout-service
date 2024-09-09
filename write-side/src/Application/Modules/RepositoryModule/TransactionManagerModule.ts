import { Module, Scope } from "@nestjs/common";
import PostGreDataSourceModule from "../DatabaseConnectionModule/PostGreDataSourceModule";
import { AlsModule } from "../AlsModule";
import TransactionManager from "src/Infrastructure/Repository/TransactionManager";

@Module({
    providers:[
        {
            provide:"TransactionManager",
            useClass:TransactionManager
        }
    ], 
    exports:["TransactionManager"], 
    imports:[PostGreDataSourceModule, AlsModule]
})
export default class TransactionManagerFactoryModule{}