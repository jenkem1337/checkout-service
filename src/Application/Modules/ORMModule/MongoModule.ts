import { Module } from "@nestjs/common";
import { MongoClient } from 'mongodb';

@Module({
    providers: [{
        provide: 'MongoDataSource',
        useFactory: async () => {
          const client = new MongoClient("mongodb://127.0.0.1:27017")
          await client.connect()
          const db = client.db("checkout_db")
          return db
        },
      }],
    exports: ["MongoDataSource"]
})
export default class MongoModule {}