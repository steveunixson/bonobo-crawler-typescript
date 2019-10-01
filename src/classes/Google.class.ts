/*
 * Copyright (c) 2019.
 * Bonobo Inc.
 */

// get metadata
// analyze metadata
// analyze how many form elements on the page
// analyze type of form elements
// has a text area tag? how many inputs? etc
// ignore hidden inputs
// collect hrefs on the page

import cheerio from 'cheerio';
import ScraperClass from './Scraper.class';

export default class GoogleClass extends ScraperClass {
  public async scrape(): Promise<string[]> {
    const html = await this.get('https://google.com/search?q=ubuntu');
    const $ = cheerio.load(html);
    const arr: string[] = [];
    const test = $('div > bkWMgd').html();
    if (test) {
      arr.push(test);
    }
    return arr;
  }
}