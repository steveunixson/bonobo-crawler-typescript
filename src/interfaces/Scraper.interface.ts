/* eslint-disable no-extra-semi,semi */
/*
 * Copyright (c) 2019.
 * Bonobo Inc.
 */

import { AxiosInstance } from 'axios';

export default interface ScraperInterface {
  url: string;
  search?: string;
  api: AxiosInstance;
  userAgent: string;
  get(url?: string): Promise<string>;
  setUserAgent(userAgent: string): void;
};
