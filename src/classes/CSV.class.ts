import { parseAsync } from 'json2csv';
import fs from 'fs';

export default class CSVClass {
  public static async writeCSV(fields: string[], data: string): Promise<void> {
    const opts = { fields };
    const file = await parseAsync(data, opts);
    await fs.writeFileSync('./test.csv', file, 'utf8');
    await console.log('file written!');
  }
}
