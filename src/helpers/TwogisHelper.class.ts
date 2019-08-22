/*
 * Copyright (c) 2019.
 * Bonobo Inc.
 */

import { Page } from 'puppeteer';
import log from '../helpers/WinstonLogger.class';

export default class TwogisHelperClass {
  public static async getData(page: Page, selector: string, property: string): Promise<string> {
    try {
      await page.$(selector);
      const Elements = await page.$$(selector);
      const promise = await Elements
        .map(async (el): Promise<string> => (await el.getProperty(property)).jsonValue());
      const Array = await Promise.all(promise);
      return Array.join();
    } catch (e) {
      await log.error(`EXCEPTION CAUGHT: ${e.toString()}`);
    }
    return 'Not Found!';
  }

  public static readonly selectors =
  {
    formSelector: 'div#module-1-3-1 > div > input',
    submitButton: '#module-1-3 > div.searchBar__forms > div > form > button.searchBar__submit._directory',
    paginationArrowRight: 'div.pagination__arrow._right',
    miniCards: '.miniCard__headerTitleLink',
    filtersWholeSale: 'label.checkbox._inline',
    companyCard: 'div.card__scrollerIn',
    companyName: 'h1.cardHeader__headerNameText',
    companyAddress: 'address.card__address',
    companyPhoneToggle: 'div.contact__toggle._place_phones',
    companyPhonesGroup: '.contact__phones._shown',
    companyVisiblePhones: '.contact__phonesVisible > div.contact__phonesItem._type_phone > a > bdo',
    companyCity: '.card__addressDrilldown._purpose_drilldown',
    companyTags: '.cardRubrics',
    companyWorkHours: '.schedule._context_firmCard._state_collapsed',
    companyWebSite: 'div.contact__websites',
  };
}
