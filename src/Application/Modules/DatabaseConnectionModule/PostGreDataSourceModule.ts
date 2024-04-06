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
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'admin',
            database: 'checkout_service_write_db',
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