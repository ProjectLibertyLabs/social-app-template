import { Client as AccountServiceWebhookClient } from '../types/openapi-account-service';
import { OpenAPIClientAxios, type Document } from 'openapi-client-axios';
import openapiJson from '../openapi-specs/account-service.json' assert { type: 'json' };
import * as Config from '../config/config';
import { HttpStatusCode } from 'axios';
import { Response } from 'express';
import logger from '../logger';
import { WebhookController } from '../controllers/WebhookController';
import { HttpError } from '../types/HttpError';

type AccountServiceWebhookResponse = {
  referenceId: string;
  handle: string;
  msaId: string;
  accountId: string;
};

export class AccountServiceWebhook {
  private static instance: AccountServiceWebhook;
  public static referenceIdsReceived: Map<string, { msaId: string; displayHandle: string; accountId: string }> =
    new Map();
  private _client: AccountServiceWebhookClient;

  private constructor() {}

  public static async getInstance(): Promise<AccountServiceWebhook> {
    if (!AccountServiceWebhook.instance) {
      AccountServiceWebhook.instance = new AccountServiceWebhook();
      await AccountServiceWebhook.instance.connect();
    }
    return AccountServiceWebhook.instance;
  }

  private async connect() {
    if (this._client === undefined) {
      const api = new OpenAPIClientAxios({
        definition: openapiJson as Document,
        withServer: { url: Config.instance().accountServiceUrl },
      });
      this._client = await api.init<AccountServiceWebhookClient>();
    }
  }

  private set client(api: AccountServiceWebhookClient) {
    this._client = api;
  }

  private get client() {
    if (this._client === undefined) {
      throw new Error(`${this.constructor.name} API not initialized`);
    }
    return this._client;
  }

  /**
   * Handles the webhook from the account service.
   * @param _req - The request object, contains the on-chain data from the account-service for the referenceId.
   * @param res - The response object.
   */
  public accountServiceWebhook({ referenceId, handle, msaId, accountId }: AccountServiceWebhookResponse) {
    // TODO: This may need to be updated when claim/change handle is implemented
    if (referenceId && handle && msaId && accountId) {
      AccountServiceWebhook.referenceIdsReceived.set(referenceId, {
        msaId,
        displayHandle: handle,
        accountId,
      });
      logger.debug(`WebhookController:authServiceWebhook: received referenceId: ${referenceId}`);
    } else {
      throw new HttpError(HttpStatusCode.BadRequest, 'Missing required fields');
    }
    return HttpStatusCode.Created;
  }
}
