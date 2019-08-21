import express from 'express';
import TwogisController from '../controllers/Twogis.controller';

export default class TwogisRouter extends TwogisController {
  public path: string = '/twogis';

  public router: express.Router = express.Router();

  public constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    // add routers here
    this.router.post(this.path, this.crawlTwogis);
  }
}
