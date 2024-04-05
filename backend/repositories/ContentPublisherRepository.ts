import { Client as ContentPublisherClient } from "../types/openapi-content-publisher.js";
import type { Components } from "../types/openapi-content-publisher.js";
import openapiJson from "../openapi-content-publisher.json" assert { type: "json" };
import { OpenAPIClientAxios, type Document } from "openapi-client-axios";
import FormData from "form-data";

type AnnouncementResponseDto = Components.Schemas.AnnouncementResponseDto;
type BroadcastDto = Components.Schemas.BroadcastDto;
type ReplyDto = Components.Schemas.ReplyDto;
type UploadResponseDto = Components.Schemas.UploadResponseDto;

export class ContentPublisherRepository {
  private static instance: ContentPublisherRepository;
  private _client: ContentPublisherClient;

  private constructor() {}

  public static async getInstance(): Promise<ContentPublisherRepository> {
    if (!ContentPublisherRepository.instance) {
      ContentPublisherRepository.instance = new ContentPublisherRepository();
      await ContentPublisherRepository.instance.connect();
    }
    return ContentPublisherRepository.instance;
  }

  private async connect() {
    if (this._client === undefined) {
      const api = new OpenAPIClientAxios({
        definition: openapiJson as Document,
      });

      this.client = await api.init<ContentPublisherClient>();
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
      const uri = this.client.getUri();
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
