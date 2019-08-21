import puppeteer, { Browser, Page } from 'puppeteer';
import TwogisHelperClass from 'src/helpers/TwogisHelper.class';
import TwogisModelInterface from '../interfaces/TwogisModel.interface';

export default class TwogisClass {
  private width: number = 1920;

  private height: number = 1080;

  public url: string;

  public search: string;

  public sendTo: string;

  public wholeSale: boolean;

  public browser: Promise<Browser>;

  public constructor(search: string, url: string, sendTo: string, wholeSale: boolean) {
    this.search = search;
    this.sendTo = sendTo;
    this.wholeSale = wholeSale;
    this.url = url;

    this.browser = new Promise((resolve) => {
      resolve();
      return puppeteer.launch({
        headless: false,
        args: [
          `--window-size=${this.width},${this.height}`, '--no-sandbox', '--disable-setuid-sandbox',
        ],
      });
    });
  }

  // Promise<TwogisModelInterface[]>

  public async crawl(): Promise<void> {
    await this.browser.newPage();
  }
}
