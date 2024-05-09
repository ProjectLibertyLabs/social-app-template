import {
  Client as ContentPublisherClient,
  type Components,
} from "../types/openapi-content-publishing-service";
import openapiJson from "../openapi-specs/content-publishing-service.json" with { type: "json" };
import { OpenAPIClientAxios, type Document } from "openapi-client-axios";
import FormData from "form-data";
import * as Config from "../config/config";

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
      throw new Error("API not initialized");
    }

    return this._client;
  }

  public async postBroadcast(
    msaId: string,
    data: BroadcastDto,
  ): Promise<AnnouncementResponseDto> {
    try {
      const res = await this.client.ApiController_broadcast(msaId, data);
      return res.data;
    } catch (e) {
      console.error("Failed to post broadcast:", e);
      throw e;
    }
  }

  public async postReply(
    msaId: string,
    data: ReplyDto,
  ): Promise<AnnouncementResponseDto> {
    try {
      const res = await this.client.ApiController_reply(msaId, data);
      return res.data;
    } catch (e) {
      console.error("Failed to post broadcast reply:", e);
      throw e;
    }
  }

  public async uploadAsset(data: FormData): Promise<UploadResponseDto> {
    try {
      const response = await this.client.put("/api/asset/upload", data, {
        headers: {
          ...data.getHeaders(),
        },
      });
      return response.data;
    } catch (e) {
      console.error("Failed to upload asset:", e);
      throw e;
    }
  }
}
