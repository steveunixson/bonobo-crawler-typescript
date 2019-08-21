/* eslint-disable no-await-in-loop,no-restricted-syntax */
import puppeteer, { Browser, Page } from 'puppeteer';
import express from 'express';
import helper from '../helpers/TwogisHelper.class';
import log from '../helpers/WinstonLogger.class';

export default class TwogisClass {
  private width: number = 1440;

  private height: number = 940;

  private timeout: number = 4 * 30000;

  public url: string;

  public search: string;

  public sendTo: string;

  public filter: string;

  public browser: Promise<Browser>;

  public page: Promise<Page>;

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

    this.page = this.initPage();
  }

  // Promise<TwogisModelInterface[]>

  public async terminate(): Promise<void> {
    try {
      const browser = await this.browser;
      await browser.close();
    } catch (e) {
      console.log(e);
    }
  }

  private async initPage(): Promise<Page> {
    const browser = await this.browser;
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: this.width, height: this.height });
      await page.setDefaultNavigationTimeout(this.timeout);
    } catch (e) {
      await log.error(`EXCEPTION CAUGHT: ${e.toString()}`);
    }
    return page;
  }

  private async searchQuery(): Promise<void> {
    try {
      const page = await this.page;
      await page.goto(this.url);
      await log.info(`Crawler started with url: ${this.url}`);
      await page.waitForSelector(helper.selectors.formSelector);
      await page.focus(helper.selectors.formSelector);
      await page.keyboard.type(this.search);
      await log.info(`Searching: ${this.search}`);
    } catch (e) {
      await log.error(`EXCEPTION CAUGHT: ${e.toString()}`);
    }
  }

  private async searchClick(): Promise<void> {
    const page = await this.page;
    try {
      await page.waitForSelector(helper.selectors.submitButton);
      await page.click(helper.selectors.submitButton);
    } catch (e) {
      await log.error(`EXCEPTION CAUGHT: ${e.toString()}`);
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
      await log.error(`EXCEPTION CAUGHT: ${e.toString()}`);
    }
  }

  private async collectCards(): Promise<string[]> {
    const page = await this.page;
    await page.waitForSelector(helper.selectors.miniCards);
    const cards = await page.$$(helper.selectors.miniCards);
    const hrefs = await cards.map(async (el): Promise<string> => (await el.getProperty('href')).jsonValue());
    const links = await Promise.all(hrefs);
    return links;
  }

  private async collectCompany(): Promise<void> {
    const newPage = await this.initPage();
    const companyLinks = await this.collectCards();
    for (const link of companyLinks) {
      try {
        await newPage.goto(link);
        await newPage.waitForSelector(helper.selectors.companyCard);
        await newPage.waitForSelector(helper.selectors.companyName);
        await newPage.waitForSelector(helper.selectors.companyAddress);
        await newPage.waitForSelector(helper.selectors.companyPhoneToggle);
      } catch (e) {
        await log.error(`EXCEPTION CAUGHT: BAD COMPANY! ${e.toString()}`);
      }
      try {
        await newPage.focus(helper.selectors.companyPhoneToggle);
        await newPage.click(helper.selectors.companyPhoneToggle);
      } catch (e) {
        await log.error(`EXCEPTION CAUGHT: NO PHONE NUMBER FOUND! ${e.toString()}`);
      }
    }
    try {
      await newPage.close();
    } catch (e) {
      await log.error(`EXCEPTION CAUGHT: ${e.toString()}`);
    }
  }

  public async crawl(): Promise<void> {
    const page = await this.page;
    await this.searchQuery();
    await this.searchClick();
    await this.searchFilter(this.filter);
    try {
      while (await page.$('div.pagination__arrow._right') !== null) {
        await this.collectCompany();
        await page.waitForSelector(helper.selectors.paginationArrowRight);
        await page.focus(helper.selectors.paginationArrowRight);
        await page.click(helper.selectors.paginationArrowRight);
      }
    } catch (e) {
      await log.error(`EXCEPTION CAUGHT: ${e}`);
    }
    // final close operation
    await this.terminate();
  }
}
