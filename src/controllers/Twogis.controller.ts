import express from 'express';
import JSONResponse from '../helpers/JSONResponse.class';

export default class TwogisController {
  public crawlTwogis = (req: express.Request, res: express.Response): void => {
    if (req.body.search && req.body.url && req.body.sendTo && req.body.wholeSale) {
      const {
        search, url, sendTo, wholeSale,
      } = req.body;
      JSONResponse.success(req, res, []);
    } else {
      JSONResponse.serverError(req, res, [], 'Bad request');
    }
  }
}
