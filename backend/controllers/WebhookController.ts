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

  /**
   * Handles the webhook from the authentication service.
   * @param _req - The request object, contains the on-chain data from the account-service for the referenceId.
   * @param res - The response object.
   */
  public authServiceWebhook(_req: Request, res: Response) {
    const { referenceId, handle, msaId, accountId } = _req.body;

    // TODO: This may need to be updated when claim/change handle is implemented
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
