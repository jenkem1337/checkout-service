import { Module } from "@nestjs/common";
import { DataSource } from "typeorm";
import CheckoutDocument from "src/Infrastructure/Documents/CheckoutDocument";
import CheckoutItemDocument from "src/Infrastructure/Documents/CheckoutItemDocument";

@Module({
    providers: [{
        provide: 'MongoDataSource',
        useFactory: async () => {
          const dataSource = new DataSource({
            type: "mongodb",
            host: "localhost",
            port: 27017,
            database: "checkout_service_read_db",
            entities: [
              CheckoutDocument, CheckoutItemDocument
            ]
          })
          return dataSource.initialize()
        },
      }],
    exports: ["MongoDataSource"]
})
export default class MongoORMModule {}