import express from 'express';
import JSONResponse from '../helpers/JSONResponse.class';

export default class IndexController {
  public index = (req: express.Request, res: express.Response): void => {
    JSONResponse.success(req, res, [], 'Hello world!');
  }
}
