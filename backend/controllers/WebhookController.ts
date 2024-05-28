import { Express, Request, Response } from 'express';
import { BaseController } from './BaseController';
import { HttpStatusCode } from 'axios';
import { AccountServiceWebhook } from '../services/AccountWebhookService';
import { HttpError } from '../types/HttpError';
import logger from '../logger';
import * as ContentRepository from '../repositories/ContentRepository';
import { GraphServiceWebhook } from '../services/GraphWebhookService';

export class WebhookController extends BaseController {
  constructor(app: Express) {
    super(app, '/webhooks');
  }

  protected initializeRoutes(): void {
    this.router.post('/account-service', this.accountServiceWebhook.bind(this));
    this.router.post('/content-watcher/announcements', this.postAnnouncementsWebhook.bind(this));
    this.router.post('/graph-service', this.graphServiceWebhook.bind(this));
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
    } catch (err) {
      logger.error({ err }, 'Error handling account service webhook:');
      if (err instanceof HttpError) {
        res.status(err.code).send(err.message).end();
      } else {
        res.status(HttpStatusCode.InternalServerError).send(err).end();
      }
    }
  }
  public async graphServiceWebhook(req: Request, res: Response) {
    try {
      const response = await GraphServiceWebhook.getInstance().then((service) => service.graphServiceWebhook(req.body));
      res.send(response).end();
    } catch (err) {
      logger.error({ err }, 'Error handling graph service webhook');
      if (err instanceof HttpError) {
        res.status(err.code).send(err.message).end();
      } else {
        res.status(HttpStatusCode.InternalServerError).send(err).end();
      }
    }
  }
  public postAnnouncementsWebhook(req: Request, res: Response) {
    ContentRepository.add(req.body);

    return res.status(HttpStatusCode.Created).send();
  }
}
