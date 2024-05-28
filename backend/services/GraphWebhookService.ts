import { Client as GraphServiceWebhookClient } from '../types/openapi-account-service';
import { OpenAPIClientAxios, type Document } from 'openapi-client-axios';
import openapiJson from '../openapi-specs/account-service.json' assert { type: 'json' };
import * as Config from '../config/config';
import { HttpStatusCode } from 'axios';
import logger from '../logger';
import { HttpError } from '../types/HttpError';

type GraphServiceWebhookResponse = {
  referenceId: string;
  msaId: string;
  update: string;
};

type GraphChangeNotification = {
  msaId: string;
  update: string;
};

export class GraphServiceWebhook {
  private static instance: GraphServiceWebhook;
  public static referenceIdsReceived: Map<string, GraphChangeNotification> = new Map();
  private _client: GraphServiceWebhookClient;

  private constructor() {}

  public static async getInstance(): Promise<GraphServiceWebhook> {
    if (!GraphServiceWebhook.instance) {
      GraphServiceWebhook.instance = new GraphServiceWebhook();
      await GraphServiceWebhook.instance.connect();
    }
    return GraphServiceWebhook.instance;
  }

  private async connect() {
    if (this._client === undefined) {
      const api = new OpenAPIClientAxios({
        definition: openapiJson as Document,
        withServer: { url: Config.instance().accountServiceUrl },
      });
      this._client = await api.init<GraphServiceWebhookClient>();
    }
  }

  private set client(api: GraphServiceWebhookClient) {
    this._client = api;
  }

  private get client() {
    if (this._client === undefined) {
      throw new Error(`${this.constructor.name} API not initialized`);
    }
    return this._client;
  }

  /**
   * Handles the webhook from the graph service.
   * @param _req - The request object, contains the on-chain data from the graph-service for the referenceId.
   * @param res - The response object.
   */
  public graphServiceWebhook({ referenceId, msaId, update }: GraphServiceWebhookResponse) {
    // TODO: This may need to be updated when claim/change handle is implemented
    if (msaId && update) {
      GraphServiceWebhook.referenceIdsReceived.set(referenceId, {
        msaId,
        update,
      });
      logger.debug(`WebhookController:authServiceWebhook: received referenceId: ${referenceId}`);
    } else {
      throw new HttpError(HttpStatusCode.BadRequest, 'Missing required fields');
    }
    return HttpStatusCode.Created;
  }
}
