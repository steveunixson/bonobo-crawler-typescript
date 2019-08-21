import log from '../helpers/WinstonLogger.class';

export default class ConfigClass {
  private port: number;

  private mongoPort: number;

  private socketPort: number;

  public constructor() {
    this.port = 3000;
    this.mongoPort = 27017;
    this.socketPort = 9020;
  }

  public PORT(): number {
    if (process.env.PORT) {
      this.port = Number(process.env.PORT);
      log.info(`USING ${this.port} PORT`);
    } else {
      log.info(`NO PORT FOUND IN THE .env FILE. USING DEFAULT ${this.port} PORT`);
    }
    return this.port;
  }

  public MONGO(): number {
    if (process.env.MONGOPORT) {
      this.mongoPort = Number(process.env.MONGOPORT);
      log.info(`CONNECTED TO MONGODB AT: ${this.mongoPort}`);
    } else {
      log.info(`NO MONGODB PORT FOUND IN THE .env FILE. USING DEFAULT ${this.mongoPort} PORT`);
    }
    return this.mongoPort;
  }
}
