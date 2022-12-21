import { DataSource } from "typeorm";
import { Scope } from "@nestjs/common";
import CheckoutDataMapper from '../../../Infrastructure/Entity/CheckoutDataMapper';
import CheckoutItemDataMapper from '../../../Infrastructure/Entity/CheckoutItemDataMapper';
import CheckoutDocument from '../../../Infrastructure/Documents/CheckoutDocument';
import CheckoutItemDocument from '../../../Infrastructure/Documents/CheckoutItemDocument';

const postGresProvider = [
    {
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
          });
    
          return dataSource.initialize();
        },
        scope:Scope.DEFAULT,
    }
]

const mongoORMProvider = [{
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
}]


export { postGresProvider, mongoORMProvider }