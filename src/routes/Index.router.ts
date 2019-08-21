import express from 'express';
import IndexController from '../controllers/Index.controller';

export default class TestsRouter extends IndexController {
  public path: string = '/';

  public router: express.Router = express.Router();

  public constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    // add routers here
    this.router.get(this.path, this.index);
  }
}
