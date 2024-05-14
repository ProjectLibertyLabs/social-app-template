import express, { Express, Router } from 'express';

export abstract class BaseController {
  public readonly router: Router;

  constructor(app: Express, baseRoute: string = '/') {
    this.router = express.Router();
    this.initializeRoutes();
    app.use(baseRoute, this.router);
  }

  protected abstract initializeRoutes(): void;
}
