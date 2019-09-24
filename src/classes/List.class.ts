/*
 * Copyright (c) 2019.
 * Bonobo Inc.
 */

import ScraperClass from './Scraper.class';

export default class ListClass extends ScraperClass {
  public async follow(href: string): Promise<void> {}

  public async paginate(selector: string): Promise<void> {}
}
