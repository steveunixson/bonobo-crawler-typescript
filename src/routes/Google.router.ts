/*
 * Copyright (c) 2019.
 * Bonobo Inc.
 */

import express from 'express';
import GoogleController from '../controllers/Google.controller';

export default class GoogleRouter extends GoogleController {
  public path: string = '/google';

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
