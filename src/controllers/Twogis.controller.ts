import express from 'express';
import { validationResult } from 'express-validator/check';
import JSONResponse from '../helpers/JSONResponse.class';
import TwogisClass from '../classes/Twogis.class';
import TwogisRequestInterface from '../interfaces/TwogisRequest.interface';

export default class TwogisController {
  public crawlTwogis = async (req: express.Request, res: express.Response): Promise<void> => {
    const { body } = req;
    try {
      await validationResult(req);
      JSONResponse.success(req, res, []);
      for await (const task of body) {
        const twogis = new TwogisClass(task as TwogisRequestInterface);
        await twogis.crawl()
          .catch(async (): Promise<void> => {
            await twogis.terminate();
          });
      }
    } catch (e) {
      JSONResponse.serverError(req, res, [e.toString()], 'Bad request');
    }
  }
}
