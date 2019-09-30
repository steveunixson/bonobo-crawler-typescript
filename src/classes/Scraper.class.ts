/*
 * Copyright (c) 2019.
 * Bonobo Inc.
 */

import axios, { AxiosInstance } from 'axios';
import ScraperInterface from '../interfaces/Scraper.interface';

export default class ScraperClass implements ScraperInterface {
  public url: string;

  public search: string | undefined;

  public api: AxiosInstance;

  public userAgent: string;

  public constructor(url: string, search?: string) {
    this.url = url;
    this.search = search;
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3835.0 Safari/537.36';
    this.api = axios.create({
      baseURL: this.url,
      timeout: 20000,
    });
  }

  public async get(url?: string): Promise<string> {
    const config = {
      headers: { 'user-agent': this.userAgent },
    };
    if (url) {
      const { data } = await this.api.get(url, config);
      return data;
    }
    const { data } = await this.api.get('/', config);
    return data;
  }

  public setUserAgent(userAgent: string): void {
    this.userAgent = userAgent;
  }
}
