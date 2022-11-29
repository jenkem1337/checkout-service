import Checkout from "../../Infrastructure/Entity/Checkout";
import CheckoutItem from "../../Infrastructure/Entity/CheckoutItem";
import { DataSource } from "typeorm";
import { Scope } from "@nestjs/common";

const ORMProviders = [
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
                Checkout, CheckoutItem
            ],
            synchronize: true,
          });
    
          return dataSource.initialize();
        },
        scope:Scope.DEFAULT,
    }
]

const testORMProvider =  [    {
  provide: 'TestDataSource',
  useFactory: async () => {
    const dataSource = new DataSource({
      type: 'sqlite',
      database:':memory:',
      entities: [
          Checkout, CheckoutItem
      ],
      synchronize: true,
    });

    return dataSource.initialize();
  },
},
]
export { ORMProviders, testORMProvider }