import { Express, Request, Response } from 'express';
import { BaseController } from './BaseController';
import { HttpStatusCode } from 'axios';
import { AccountServiceWebhook } from '../services/AccountWebhookService';
import { HttpError } from '../types/HttpError';
import logger from '../logger';

export class WebhookController extends BaseController {
  constructor(app: Express) {
    super(app, '/webhooks');
  }

  protected initializeRoutes(): void {
    this.router.post('/account-service', this.accountServiceWebhook.bind(this));
  }

  /**
   * Handles the account service webhook.
   *
   * @param req - The request object, the body contains the on-chain data from the account-service for the referenceId.
   * @param res - The response object.
   */
  public async accountServiceWebhook(req: Request, res: Response) {
    try {
      const response = await AccountServiceWebhook.getInstance().then((service) =>
        service.accountServiceWebhook(req.body)
      );
      res.send(response).end();
    } catch (e) {
      logger.error(`Error handling account service webhook: ${e}`);
      if (e instanceof HttpError) {
        res.status(e.code).send(e.message).end();
      } else {
        res.status(HttpStatusCode.InternalServerError).send(e).end();
      }
    }
  }
}
