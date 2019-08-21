import express from 'express';
import JSONResponse from '../helpers/JSONResponse.class';
import TwogisClass from '../classes/Twogis.class';

export default class TwogisController {
  public crawlTwogis = (req: express.Request, res: express.Response): void => {
    if (req.body.search && req.body.url && req.body.sendTo) {
      const twogis = new TwogisClass(req);
      twogis.crawl()
        .then((): void => {})
        .catch((e): void => {
          console.log(e.toString());
          twogis.terminate()
            .then((): void => {})
            .catch((ex): void => {
              console.log(ex.toString());
            });
        });
      JSONResponse.success(req, res, []);
    } else {
      JSONResponse.serverError(req, res, [], 'Bad request');
    }
  }
}
