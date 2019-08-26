import { parseAsync } from 'json2csv';
import fs from 'fs';
import TwogisInterface from '../interfaces/Twogis.interface';
import log from '../helpers/WinstonLogger.class';

export interface CSVClassInterface {
  fields: string[];
  data: TwogisInterface[];
  name: string;
  path: string;
}

export default class CSVClass {
  public static async writeCSV(options: CSVClassInterface): Promise<void> {
    const {
      fields, name, data, path,
    } = options;
    const opts = { fields };
    const file = await parseAsync(data, opts);
    await fs.writeFileSync(`${path}/${name}`, file, 'utf8');
    await log.info('CSV FILE CREATED!');
  }
}
