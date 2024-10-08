import { Express, Request, Response } from 'express';
import { BaseController } from './BaseController';
import { HttpStatusCode } from 'axios';
import * as AccountServiceWebhook from '../services/AccountWebhookService';
import { HttpError } from '../types/HttpError';
import logger from '../logger';
import { ContentRepository } from '../repositories/ContentRepository';
import * as GraphWebhookService from '../services/GraphWebhookService';
import { sseManager } from '../utils/sse';

export class WebhookController extends BaseController {
  constructor(app: Express) {
    super(app, '/webhooks');
  }

  protected initializeRoutes(): void {
    this.router.post('/account-service', this.accountServiceWebhook.bind(this));
    this.router.post('/content-watcher/announcements', this.postAnnouncementsWebhook.bind(this));
    this.router.post('/graph-service/notifications', this.graphServiceNotifications.bind(this));
    this.router.post('/graph-service/operation-status', this.graphServiceOperationStatus.bind(this));
  }

  /**
   * Handles the account service webhook.
   *
   * @param req - The request object, the body contains the on-chain data from the account-service for the referenceId.
   * @param res - The response object.
   */
  public async accountServiceWebhook(req: Request, res: Response) {
    try {
      const response = AccountServiceWebhook.accountServiceWebhook(req.body);
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

  public async graphServiceNotifications(req: Request, res: Response) {
    try {
      logger.debug({ body: req.body }, 'GraphServiceWebhook body');
      const response = GraphWebhookService.processGraphUpdateNotification(req.body);
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

  public async graphServiceOperationStatus(req: Request, res: Response) {
    try {
      logger.debug({ body: req.body }, '/graph-service/operation-status body');
      const response = GraphWebhookService.requestRefIdWebhook(req.body);
      res.send(response).end();
    } catch (err) {
      logger.error({ err }, 'Error handling graph-service operation status webhook');
      if (err instanceof HttpError) {
        res.status(err.code).send(err.message).end();
      } else {
        res.status(HttpStatusCode.InternalServerError).send(err).end();
      }
    }
  }

  public postAnnouncementsWebhook(req: Request, res: Response) {
    ContentRepository.addAnnouncement(req.body);

    logger.debug({ announcement: req.body }, 'postAnnouncementsWebhook: Announcement received');
    logger.trace('postAnnouncementsWebhook: sseManager Broadcasting announcement');
    sseManager.broadcast('announcement', req.body);

    return res.status(HttpStatusCode.Created).send();
  }
}
