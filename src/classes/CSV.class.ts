import { parse } from 'json2csv';
import fs from 'fs';

export default class CSVClass {

  private readonly data: object;

  public constructor(data: object) {
    this.data = data;
  }

  public async writeCSV(fields: []): Promise<void> {
    const opts = { fields };
    const csv = parse(this.data, opts);
    const stream = fs.createWriteStream('report.csv');
    stream
      .once('open', (): void => {
        stream.write(csv, 'utf8');
        stream.end();
      })
      .on('finish', (): void => {
        console.log('wrote all data to file');
      });
  }
}
