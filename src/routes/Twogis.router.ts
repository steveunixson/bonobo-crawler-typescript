import express from 'express';
import { check, ValidationChain } from 'express-validator';
import TwogisController from '../controllers/Twogis.controller';
import TwogisValidation from '../validations/Twogis.validation';

export default class TwogisRouter extends TwogisController {
  public path: string = '/twogis';

  public router: express.Router = express.Router();

  public validation: ValidationChain[];

  public constructor() {
    super();
    this.validation = new TwogisValidation().schema();
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    // add routers here
    this.router.post(this.path, this.validation, this.crawlTwogis);
  }
}
