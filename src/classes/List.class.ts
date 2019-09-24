/*
 * Copyright (c) 2019.
 * Bonobo Inc.
 */

import cheerio from 'cheerio';
import ScraperClass from './Scraper.class';

export default class ListClass extends ScraperClass {
  public $ = cheerio.load(`${this.get()}`);

  public async follow(href: string): Promise<void> {}

  public async paginate(selector: string): Promise<void> {}
}
