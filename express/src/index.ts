import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import database from './config/database';
import initializeRoutes from './routes';
import webpush from './config/webpush';
import {MongoMemoryServer} from "mongodb-memory-server";

const app = express();
app.use(cors());
const port = 8080; // default port to listen

app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json());

database();
initializeRoutes(app);
webpush();

// start the Express server
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
});

const exitHandler = async () => {
  // @ts-ignore
  const mongod = global.__MONGOD__ as MongoMemoryServer;
  if (mongod) {
    await mongod.stop({doCleanup: false})
  }
  /*
  if (server) {
    server.close(() => {
      console.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
  */
};

const unexpectedErrorHandler = (error: unknown) => {
  console.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
