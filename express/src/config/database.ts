import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from "path";
import * as os from "os";
import * as fs from "fs";

export default async () => {
  const dbPath = path.join(
    os.tmpdir(),
    `mongodb-mem`
  );

  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
  }
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbPath,
      dbName: 'web-push-notifications',
      storageEngine: 'wiredTiger'
    }
  });
  // @ts-ignore
  global.__MONGOD__ = mongod;
  const uri = mongod.getUri();
  // Connect to the database
  // const url = 'mongodb://localhost/web-push-notifications';
  const url = `${uri}web-push-notifications`;
  try {
    return await mongoose.connect(url, {
      // New default true always
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    // New default true always
    // mongoose.set('useCreateIndex', true);
  } catch (e) {
    console.error(`Couldn't connect to the database: ${e}`);
    process.exit(1);
  }
  console.log(`Connected to the database ${url} `);
};
