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

import { JSDOM } from 'jsdom';
import ScraperClass from './Scraper.class';

export default class GoogleClass extends ScraperClass {
  protected getTextByAttribute(document: Document, selector: string, attribute: string): string[] {
    const arr: string[] = [];
    document.querySelectorAll(selector).forEach((el): void => {
      const href = el.getAttribute(attribute);
      if (href) {
        arr.push(href);
      }
    });
    return arr;
  }

  public async scrape(): Promise<void> {
    const html = await this.get();
    const { window: { document } } = new JSDOM(html);
    const urls = this.getTextByAttribute(document, '.r > a', 'href');
    for await (const url of urls) {
      const Html = await this.get(url);
      const dom = new JSDOM(Html);
      console.log('SENDING REQUEST TO', url);
      const arr: string[] = [];
      dom.window.document.querySelectorAll('form').forEach((el): void => {
        const href = el.outerHTML;
        if (href) {
          arr.push(href);
        }
      });
      console.log(arr);
    }
  }
}
