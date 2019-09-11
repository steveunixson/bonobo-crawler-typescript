import express from 'express';
import puppeteer, { Browser, Page } from 'puppeteer';
import log from '../helpers/WinstonLogger.class';
import TwogisInterface from '../interfaces/Twogis.interface';
import { MailOptions } from './Mailer.class';
import CrawlerHelper from '../helpers/Crawler.helper';

export default class CrawlerClass {
  protected search: string;

  protected timeout: number = 4 * 30000;

  protected sendTo: string;

  protected filter: string;

  protected url: string;

  protected browser: Promise<Browser>;

  protected width: number = 1440;

  protected height: number = 940;

  protected searchCity: string;

  protected mailConfig: MailOptions;

  protected page: Promise<Page>;

  public constructor(req: express.Request) {
    this.search = req.body.search;
    this.sendTo = req.body.sendTo;
    this.filter = req.body.filter;
    this.url = req.body.url;

    this.browser = puppeteer.launch({
      headless: false,
      args: [
        `--window-size=${this.width},${this.height}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--enable-features=NetworkService',
      ],
    });

    this.searchCity = '';

    this.mailConfig = {
      to: this.sendTo,
      from: 'unixson@gmail.com',
      subject: '',
      text: '',
    };

    this.page = this.initPage();
  }

  protected RemoveFormArray = (array: TwogisInterface[], number: string): TwogisInterface[] => array
    .filter((el: TwogisInterface): boolean => el.companyName !== number);

  public async terminate(): Promise<void> {
    try {
      const browser = await this.browser;
      await browser.close();
    } catch (e) {
      await log.error(`EXCEPTION CAUGHT terminate: ${e.toString()}`);
    }
  }

  protected async initPage(): Promise<Page> {
    const browser = await this.browser;
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: this.width, height: this.height });
      await page.setDefaultNavigationTimeout(this.timeout);
      await page.on('response', async (response): Promise<void> => {
        const status = response.status();
        if ((status >= 300) && (status <= 399) && response.headers().location.includes('ohio8.vchecks.info')) {
          log.info(`Redirected from ${response.url()} to ${response.headers().location}`);
          await page.setUserAgent(new CrawlerHelper().userAgent());
          log.info('USER AGENT CHANGED');
        }
      });
    } catch (e) {
      await this.terminate();
      await log.error(`EXCEPTION CAUGHT initPage: ${e.toString()}`);
    }
    return page;
  }
}
