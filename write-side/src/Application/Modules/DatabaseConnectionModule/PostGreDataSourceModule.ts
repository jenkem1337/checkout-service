import { Module } from "@nestjs/common";
import CheckoutDataMapper from "../../../Infrastructure/Entity/CheckoutDataMapper";
import CheckoutItemDataMapper from "../../../Infrastructure/Entity/CheckoutItemDataMapper";
import { DataSource } from "typeorm";

@Module({
    providers: [{
        provide: 'DataSource',
        useFactory: async () => {
          const dataSource = new DataSource({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: new Number(process.env.POSTGRES_PORT).valueOf(),
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB_NAME,
            entities: [
              CheckoutDataMapper, CheckoutItemDataMapper
            ],
            synchronize:true
          });
    
          return await dataSource.initialize();
        },
    }],
    exports:["DataSource"]
})
export default class PostGreDataSourceModule{}