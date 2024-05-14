import { Express, Request, Response } from 'express';
import { BaseController } from './BaseController';
import { HttpStatusCode } from 'axios';
import logger from '../logger';

export class WebhookController extends BaseController {
  public static referenceIdsReceived: Map<string, { msaId: string; displayHandle: string; accountId: string }> =
    new Map();

  constructor(app: Express) {
    super(app, '/webhooks');
  }

  protected initializeRoutes(): void {
    this.router.post('/account-service', this.authServiceWebhook.bind(this));
  }

  public authServiceWebhook(_req: Request, res: Response) {
    logger.debug(_req, 'WebhookController:authServiceWebhook: received webhook from account-service');
    const { referenceId, handle, msaId, accountId } = _req.body;

    if (referenceId && handle && msaId && accountId) {
      WebhookController.referenceIdsReceived.set(referenceId, {
        msaId,
        displayHandle: handle,
        accountId,
      });
      logger.debug(`WebhookController:authServiceWebhook: received referenceId: ${referenceId}`);
    } else {
      logger.error(`WebhookController:authServiceWebhook: missing required fields`);
      return res.status(HttpStatusCode.BadRequest).send();
    }

    return res.status(HttpStatusCode.Created).send();
  }
}
