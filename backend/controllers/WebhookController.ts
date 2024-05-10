import { Express, Request, Response } from 'express';
import { BaseController } from './BaseController';
import { HttpStatusCode } from 'axios';

export class WebhookController extends BaseController {
  constructor(app: Express) {
    super(app, '/webhooks');
  }

  protected initializeRoutes(): void {
    this.router.post('/account-service', this.authServiceWebhook.bind(this));
  }

  public authServiceWebhook(_req: Request, res: Response) {
    return res.status(HttpStatusCode.Created).send();
  }
}
