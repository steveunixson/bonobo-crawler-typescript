/* eslint-disable no-await-in-loop,no-restricted-syntax */
import puppeteer, { Browser, Page } from 'puppeteer';
import express from 'express';
import helper from '../helpers/TwogisHelper.class';
import log from '../helpers/WinstonLogger.class';
import TwogisSchema from '../models/Twogis.model';
import TwogisInterface from '../interfaces/Twogis.interface';
import CSVClass from './CSV.class';
import MailerClass, { MailOptions } from './Mailer.class';
import ConfigClass from './Config.class';

export default class TwogisClass {
  private width: number = 1440;

  private height: number = 940;

  private timeout: number = 4 * 30000;

  private fields: string[] = [
    'phoneNumber',
    'companyName',
    'address',
    'city',
    'site',
    'search',
    'tags',
    'hours',
  ];

  public url: string;

  public search: string;

  public sendTo: string;

  public filter: string;

  public searchCity: string;

  public browser: Promise<Browser>;

  public page: Promise<Page>;

  public result: TwogisInterface[] = [];

  private readonly mailConfig: MailOptions;

  public constructor(req: express.Request) {
    this.search = req.body.search;
    this.sendTo = req.body.sendTo;
    this.filter = req.body.filter;
    this.url = req.body.url;

    this.browser = puppeteer.launch({
      headless: false,
      args: [
        `--window-size=${this.width},${this.height}`, '--no-sandbox', '--disable-setuid-sandbox',
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

  public async terminate(): Promise<void> {
    try {
      const browser = await this.browser;
      await browser.close();
    } catch (e) {
      await log.error(`EXCEPTION CAUGHT terminate: ${e.toString()}`);
    }
  }

  private async initPage(): Promise<Page> {
    const browser = await this.browser;
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: this.width, height: this.height });
      await page.setDefaultNavigationTimeout(this.timeout);
    } catch (e) {
      await this.terminate();
      await log.error(`EXCEPTION CAUGHT initPage: ${e.toString()}`);
    }
    return page;
  }

  private async searchQuery(): Promise<void> {
    try {
      const page = await this.page;
      await page.goto(this.url, { waitUntil: 'load', timeout: 0 });
      await log.info(`Crawler started with url: ${this.url}`);
      await page.waitForSelector(helper.selectors.formSelector);
      this.searchCity = await helper.getData(page, helper.selectors.searchCity, 'innerText');
      await page.focus(helper.selectors.formSelector);
      await page.keyboard.type(this.search);
      await log.info(`Searching: ${this.search}`);
    } catch (e) {
      await this.terminate();
      await log.error(`EXCEPTION CAUGHT searchQuery: ${e.toString()}`);
    }
  }

  private async searchClick(): Promise<void> {
    const page = await this.page;
    try {
      await page.waitForSelector(helper.selectors.submitButton);
      await page.click(helper.selectors.submitButton);
    } catch (e) {
      await this.terminate();
      await log.error(`EXCEPTION CAUGHT searchClick: ${e.toString()}`);
    }
  }

  private async searchFilter(filter: string): Promise<void> {
    const page = await this.page;
    try {
      if (this.filter) {
        await page.waitForSelector(helper.selectors.filtersWholeSale);
        const Filters = await page.$$(helper.selectors.filtersWholeSale);
        if (Filters) {
          Filters.forEach(async (el): Promise<void> => {
            const text = await (await el.getProperty('textContent')).jsonValue();
            if (text === filter) {
              await log.info(`Used filter: ${filter}`);
              await el.click();
            }
          });
        }
      }
    } catch (e) {
      await log.error(`EXCEPTION CAUGHT searchFilter: ${e.toString()}`);
    }
  }

  private async collectCards(): Promise<string[]> {
    const page = await this.page;
    await page.waitForSelector(helper.selectors.miniCards);
    const cards = await page.$$(helper.selectors.miniCards);
    const href = await cards.map(async (el): Promise<string> => (await el.getProperty('href')).jsonValue());
    return Promise.all(href);
  }

  private async saveCompany(company: TwogisInterface): Promise<void> {
    const twogis = new TwogisSchema(company);
    try {
      await twogis.save();
      this.result.push(company);
    } catch (e) {
      this.result.push(company);
      log.error(`EXCEPTION saveCompany: ${e.toString()}`);
    }
  }

  private async collectCompany(): Promise<void> {
    const newPage = await this.initPage();
    const companyLinks = await this.collectCards();

    for (const link of companyLinks) {
      await newPage.goto(link);
      try {
        await newPage.waitForSelector(helper.selectors.companyPhoneToggle, { timeout: 2000 });
        await newPage.focus(helper.selectors.companyPhoneToggle);
        await newPage.click(helper.selectors.companyPhoneToggle);
        const phones = await helper.getData(newPage, helper.selectors.companyVisiblePhones, 'innerText');
        const name = await helper.getData(newPage, helper.selectors.companyName, 'innerText');
        const address = await helper.getData(newPage, helper.selectors.companyAddress, 'innerText');
        const city = await helper.getData(newPage, helper.selectors.companyCity, 'innerText');
        const tags = await helper.getData(newPage, helper.selectors.companyTags, 'innerText');
        const workHours = await helper.getData(newPage, helper.selectors.companyWorkHours, 'innerText');
        const site = await helper.getData(newPage, helper.selectors.companyWebSite, 'innerText');
        await this.saveCompany({
          phoneNumber: phones,
          companyName: name,
          address,
          city,
          site,
          search: this.search,
          tags,
          hours: workHours,
        });
      } catch (e) {
        log.error(`EXCEPTION collectCompany: ${e.toString()}`);
      }
    }
    await newPage.close();
  }

  private async sendMail(): Promise<void> {
    try {
      const time = new Date().getTime();
      const fileAttachment = `${this.searchCity}_${this.search.replace(' ', '_')}_${time}.csv`;
      await this.terminate();
      const path = new ConfigClass().CSVPATH();
      await CSVClass.writeCSV({
        fields: this.fields,
        data: this.result,
        name: fileAttachment,
        path,
      });
      await log.info(`Sending: ${fileAttachment}`);
      this.mailConfig.text = `${this.search} в городе ${this.searchCity}`;
      this.mailConfig.subject = `БАЗА ${this.searchCity}`;
      const mail = new MailerClass(this.mailConfig);
      await mail.attachments(path, fileAttachment);
      await mail.send();
    } catch (e) {
      log.error(`EXCEPTION CAUGHT sendMail: ${e.toString()}`);
    }
  }

  public async crawl(): Promise<void> {
    const page = await this.page;
    await this.searchQuery();
    await this.searchClick();
    await this.searchFilter(this.filter);

    try {
      await page.waitForSelector('div.pagination__pages', { timeout: 2000 });
    } catch (e) {
      await log.error(`EXCEPTION CAUGHT crawl: ${e.toString()}`);
    } finally {
      try {
        const next = await page.$('div.pagination__arrow._right');

        const searchPages = await page.$('div.pagination__pages');

        if (!searchPages) {
          await this.collectCompany();
        } else {
          while (next !== null) {
            await this.collectCompany();
            await page.waitForSelector(helper.selectors.paginationArrowRight);
            await page.focus(helper.selectors.paginationArrowRight);
            await page.click(helper.selectors.paginationArrowRight);
            const nextDisabled = await page.$('div.pagination__arrow._right._disabled');
            if (nextDisabled) {
              break;
            }
          }
        }
      } catch (e) {
        await log.error(`EXCEPTION CAUGHT crawl: ${e.toString()}`);
      } finally {
        await this.sendMail();
      }
    }
  }
}
