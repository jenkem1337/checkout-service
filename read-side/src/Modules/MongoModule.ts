import { Module } from "@nestjs/common";
import { MongoClient } from 'mongodb';

@Module({
    providers: [{
        provide: 'MongoDataSource',
        useFactory: async () => {
          const client = new MongoClient(process.env.MONGO_CLIENT)
          await client.connect()
          const db = client.db(process.env.MONGO_DB_NAME)
          return db
        },
      }],
    exports: ["MongoDataSource"]
})
export default class MongoModule {}