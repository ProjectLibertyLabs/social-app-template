import { Client as ContentWatcherClient, Components } from '../types/openapi-content-watcher-service';
import openapiJson from '../openapi-specs/content-watcher-service.json' with { type: 'json' };
import { OpenAPIClientAxios, type Document } from 'openapi-client-axios';
import * as Config from '../config/config';
import logger from '../logger';
import { AnnouncementType } from '../types/content-announcement';

type ResetScannerDto = Components.Schemas.ResetScannerDto;

export class ContentWatcherService {
  private static instance: ContentWatcherService;
  private _client: ContentWatcherClient;

  private constructor() {}

  public static async getInstance(): Promise<ContentWatcherService> {
    if (!ContentWatcherService.instance) {
      ContentWatcherService.instance = new ContentWatcherService();
      await ContentWatcherService.instance.connect();
    }
    return ContentWatcherService.instance;
  }

  private async connect() {
    if (this._client === undefined) {
      const api = new OpenAPIClientAxios({
        definition: openapiJson as Document,
        withServer: Config.instance().contentPublisherUrl,
      });

      this.client = await api.init<ContentWatcherClient>();
      this.client.defaults.baseURL = Config.instance().contentWatcherUrl;
    }
  }
  private set client(api: ContentWatcherClient) {
    this._client = api;
  }

  private get client() {
    if (this._client === undefined) {
      throw new Error('API not initialized');
    }

    return this._client;
  }

  /**
   * Registers a webhook with the specified URL and announcement types.
   * @param url - The URL of the webhook.
   * @param announcementTypes - An array of announcement types.
   */
  public async registerWebhook(url: string, announcementTypes: AnnouncementType[]) {
    try {
      let registeredWebhooks = await this.client.WebhookControllerV1_getRegisteredWebhooks();
      logger.debug(registeredWebhooks.data, 'Currently registered webhooks for content-watcher-service:');
      await this.client.WebhookControllerV1_registerWebhook(null, {
        url,
        announcementTypes: announcementTypes.map((prop) => AnnouncementType[prop].toLowerCase()),
      });
      registeredWebhooks = await this.client.WebhookControllerV1_getRegisteredWebhooks();
      logger.debug(registeredWebhooks.data, 'Updated registered webhooks for content-watcher-service:');
    } catch (err) {
      logger.error(err, 'Error registering content-watcher webhook');
    }
  }

  /**
   * Resets the scanner for content-watcher.
   *
   * @param options - The options for resetting the scanner.
   */
  public async resetScanner(options: ResetScannerDto) {
    try {
      await this.client.ScanControllerV1_resetScanner(null, options);
    } catch (err) {
      logger.error(err, 'Error resetting content-watcher scan');
    }
  }

  /**
   * Retrieves the scanner ready status of the content-watcher.
   * @returns A Promise that resolves to a boolean indicating whether the scanner is ready or not.
   */
  public async getScannerReadyStatus(): Promise<boolean> {
    try {
      const response = await this.client.HealthController_readyz(null);
      if (response.status === 200) {
        logger.debug('Content-watcher scanner is ready');
      }
      return true;
    } catch (err) {
      logger.error(err, 'Error getting content-watcher scanner ready status');
      return false;
    }
  }
}
