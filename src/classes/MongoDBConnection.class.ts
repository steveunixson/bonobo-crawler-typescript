import mongoose from 'mongoose';
import log from '../helpers/WinstonLogger.class';
import MongooseInterface from '../interfaces/Mongoose.interface';

export default class MongoDBConnection {
  public settings: MongooseInterface;

  public uri: string;

  public constructor(uri: string, settings: MongooseInterface) {
    this.settings = settings;
    this.uri = uri;
    mongoose.Promise = Promise;
    mongoose.set('useCreateIndex', true);
  }

  private connectionEvent = mongoose.connection.on('connected', (): void => {
    log.info('Connection Established');
  });

  private reconnectedEvent = mongoose.connection.on('reconnected', (): void => {
    log.info('Connection Reestablished');
  });

  private disconnectedEvent = mongoose.connection.on('disconnected', (): void => {
    log.info('Connection Disconnected');
  });

  private closeEvent = mongoose.connection.on('close', (): void => {
    log.info('Connection Closed');
  });

  private errorEvent = mongoose.connection.on('error', (error): void => {
    log.error(`ERROR: ${error.toString()}`);
  });

  public async connect(): Promise<void> {
    await this.connectionEvent;
    await this.reconnectedEvent;
    await this.disconnectedEvent;
    await this.closeEvent;
    await this.errorEvent;
    await mongoose.connect(this.uri, this.settings);
  }
}
