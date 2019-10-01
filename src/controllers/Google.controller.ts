/*
 * Copyright (c) 2019.
 * Bonobo Inc.
 */

import express from 'express';
import JSONResponse from '../helpers/JSONResponse.class';
import GoogleClass from '../classes/Google.class';

export default class GoogleController {
  public index = async (req: express.Request, res: express.Response): Promise<void> => {
    const search = encodeURI(`https://google.com/search?q=${req.body.search}`);
    try {
      await new GoogleClass(search).scrape();
      JSONResponse.success(req, res, [], 'Collecting data set!');
    } catch (e) {
      JSONResponse.serverError(req, res, [], `${e.toString()}`);
    }
  }
}
