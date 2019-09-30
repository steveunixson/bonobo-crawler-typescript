/*
 * Copyright (c) 2019.
 * Bonobo Inc.
 */

import express from 'express';
import JSONResponse from '../helpers/JSONResponse.class';
import GoogleClass from '../classes/Google.class';

export default class GoogleController {
  public index = (req: express.Request, res: express.Response): void => {
    new GoogleClass('https://google.com').scrape()
      .then((data): void => {
        JSONResponse.success(req, res, [{ data }], 'Google scraped!');
      })
      .catch((e): void => {
        JSONResponse.serverError(req, res, [], `${e.toString()}`);
      });
  }
}
