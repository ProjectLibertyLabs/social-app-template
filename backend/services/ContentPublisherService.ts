import { Client as ContentPublisherClient, type Components } from '../types/openapi-content-publishing-service';
import openapiJson from '../openapi-specs/content-publishing.openapi.json' with { type: 'json' };
import { OpenAPIClientAxios, type Document } from 'openapi-client-axios';
import FormData from 'form-data';
import * as Config from '../config/config';
import logger from '../logger';

type AnnouncementResponseDto = Components.Schemas.AnnouncementResponseDto;
type BroadcastDto = Components.Schemas.BroadcastDto;
type ReplyDto = Components.Schemas.ReplyDto;
type UploadResponseDto = Components.Schemas.UploadResponseDto;

export class ContentPublisherService {
  private static instance: ContentPublisherService;
  private _client: ContentPublisherClient;

  private constructor() {}

  public static async getInstance(): Promise<ContentPublisherService> {
    if (!ContentPublisherService.instance) {
      ContentPublisherService.instance = new ContentPublisherService();
      await ContentPublisherService.instance.connect();
    }
    return ContentPublisherService.instance;
  }

  private async connect() {
    if (this._client === undefined) {
      const api = new OpenAPIClientAxios({
        definition: openapiJson as Document,
        withServer: Config.instance().contentPublisherUrl,
      });

      this.client = await api.init<ContentPublisherClient>();
      this.client.defaults.baseURL = Config.instance().contentPublisherUrl;
    }
  }
  private set client(api: ContentPublisherClient) {
    this._client = api;
  }

  private get client() {
    if (this._client === undefined) {
      throw new Error('API not initialized');
    }

    return this._client;
  }

  public async postBroadcast(msaId: string, data: BroadcastDto): Promise<AnnouncementResponseDto> {
    try {
      const res = await this.client.ContentControllerV1_broadcast(msaId, data);
      return res.data;
    } catch (err) {
      logger.error({ err }, 'Failed to post broadcast');
      throw err;
    }
  }

  public async postReply(msaId: string, data: ReplyDto): Promise<AnnouncementResponseDto> {
    try {
      const res = await this.client.ContentControllerV1_reply(msaId, data);
      return res.data;
    } catch (err) {
      logger.error({ err }, 'Failed to post broadcast reply');
      throw err;
    }
  }

  public async uploadAsset(data: FormData): Promise<UploadResponseDto> {
    try {
      const response = await this.client.put('/v1/asset/upload', data, {
        headers: {
          ...data.getHeaders(),
        },
      });
      return response.data;
    } catch (err) {
      logger.error({ err }, 'Failed to upload asset');
      throw err;
    }
  }
}
