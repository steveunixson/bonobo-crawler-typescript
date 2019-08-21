import * as bodyParser from 'body-parser';
import express, { Express } from 'express';
import morgan from 'morgan';
import methodOverride from 'method-override';
import { config } from 'dotenv';
import fileUpload from 'express-fileupload';
import { resolve } from 'path';
import MongooseConnection from '../classes/MongoDBConnection.class';
import ConfigClass from './Config.class';
import IndexRouter from '../routes/Index.router';
import log from '../helpers/WinstonLogger.class';
import TwogisRouter from '../routes/Twogis.router';

export default class App {
  private readonly app: Express;

  private readonly port: number;

  private mongo: MongooseConnection;

  private readonly mongoPort: number;

  private config: ConfigClass;

  public constructor() {
    config({
      path: resolve(__dirname, '../../../.env'),
      debug: true,
    });
    this.config = new ConfigClass();
    this.port = this.config.PORT();
    this.mongoPort = this.config.MONGO();
    this.app = express();
    this.app.use(methodOverride());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
    }));
    this.app.use(morgan('dev'));
    this.app.use(new IndexRouter().router);
    this.app.use(new TwogisRouter().router);
    this.mongo = new MongooseConnection(`mongodb://localhost:${this.mongoPort}/octopus`, {
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectTries: 1000000,
      reconnectInterval: 1000,
    });
  }

  public start(): void {
    try {
      this.mongo.connect().then((): void => {
        this.app.listen(this.port);
      });
      log.info(`STARTED EXPRESS APP AT: ${this.port}`);
    } catch (exception) {
      log.error(`FAILED TO START THE APP WITH ${exception}`);
    }
  }
}
