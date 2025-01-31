import fs from 'fs';
import os from 'os';
import log from '../helpers/WinstonLogger.class';


export default class ConfigClass {
  private port: number;

  private mongoPort: number;

  private socketPort: number;

  private csvPath: string;

  public constructor() {
    this.port = 3200;
    this.mongoPort = 27017;
    this.socketPort = 9020;
    this.csvPath = './';
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

  public CSVPATH(): string {
    const homeDir = os.homedir();
    const crawlerDir = 'JARVIS';
    if (!fs.existsSync(`${homeDir}/${crawlerDir}/`)) {
      fs.mkdirSync(`${homeDir}/${crawlerDir}/`);
      log.info(`Created directory: ${homeDir}/${crawlerDir}/`);
    }
    this.csvPath = `${homeDir}/${crawlerDir}`;
    return this.csvPath;
  }
}
