import zlib from 'node:zlib';
import { getSchemaId } from './announce.js';
import { AnnouncementType } from './dsnp.js';
import { getApi, getNonce, getProviderKey } from './frequency.js';
import { dsnp } from '@dsnp/frequency-schemas';
import avro from 'avro-js';
import { Components, Client as GraphServiceClient } from '../types/openapi-graph-service';
import { OpenAPIClientAxios, type Document } from 'openapi-client-axios';
import openapiJson from '../openapi-specs/graph-service.json' assert { type: 'json' };
import * as Config from '../config/config';
import { getMsaforPublicKey } from '@amplica-labs/siwf';
import logger from '../logger.js';

type GraphsQueryParamsDto = Components.Schemas.GraphsQueryParamsDto;
type GraphKeyPairDto = Components.Schemas.GraphKeyPairDto;
type UserGraphDto = Components.Schemas.UserGraphDto;
type ProviderGraphDto = Components.Schemas.ProviderGraphDto;

// { userId, since }
const publicFollowsAvro = avro.parse(dsnp.userPublicFollows.types[0]);
// { compressedPublicGraph: bytes }
const publicFollowsCompressed = avro.parse(dsnp.userPublicFollows);

interface GraphEdge {
  userId: number;
  since: number;
}

export class GraphService {
  private static instance: GraphService;
  private _client: GraphServiceClient;

  private constructor() {}

  public static async getInstance(): Promise<GraphService> {
    if (!GraphService.instance) {
      GraphService.instance = new GraphService();
      await GraphService.instance.connect();
    }
    return GraphService.instance;
  }

  private async connect() {
    if (this._client === undefined) {
      const api = new OpenAPIClientAxios({
        definition: openapiJson as unknown as Document,
        withServer: { url: Config.instance().graphServiceUrl },
      });
      this._client = await api.init<GraphServiceClient>();
    }
  }

  private set client(api: GraphServiceClient) {
    this._client = api;
  }

  private get client(): GraphServiceClient {
    if (this._client === undefined) {
      throw new Error(`${this.constructor.name} API not initialized`);
    }
    return this._client;
  }

  /**
   * Inflates a payload string and returns an array of GraphEdge objects.
   * @param payload - The payload string to be inflated.
   * @returns An array of GraphEdge objects.
   */
  private inflatePage(payload: string): GraphEdge[] {
    if (!payload) return [];
    try {
      const buf = Buffer.from(payload.substring(2), 'hex');
      const container = publicFollowsCompressed.fromBuffer(buf);
      const data = zlib.inflateSync(container.compressedPublicGraph);
      const graphEdges = publicFollowsAvro.fromBuffer(data);
      return graphEdges;
    } catch (e) {
      logger.error(`Error parsing page: ${e}`);
      return [];
    }
  }

  private deflatePage(edges: GraphEdge[]) {
    const inside = publicFollowsAvro.toBuffer(edges);
    const compressedPublicGraph = zlib.deflateSync(inside);
    return publicFollowsCompressed.toBuffer({ compressedPublicGraph });
  }

  /**
   * Retrieves the list of public follows for a given MSA ID.
   * @param msaId - The MSA ID for which to retrieve the public follows.
   * @returns A promise that resolves to an array of strings representing the user IDs of the public follows.
   */
  public async getPublicFollows(msaId: string): Promise<string[]> {
    const graphsQueryParamsDto: GraphsQueryParamsDto = {
      dsnpIds: [msaId],
      privacyType: 'public',
      graphKeyPairs: [],
    };
    logger.debug(`GraphService: getPublicFollows: msaId(${msaId}), graphsQueryParamsDto:(${JSON.stringify(graphsQueryParamsDto)}`);
    const resp = await this.client.ApiController_getGraphs(null, graphsQueryParamsDto);
    const userGraphDto: UserGraphDto[] = resp.data;
    logger.warn(`GraphService: getPublicFollows userGraphDto:(${JSON.stringify(userGraphDto)})`);
    const followList: string[] = userGraphDto
      .map((userGraph) => userGraph.dsnpGraphEdges?.map((edge) => edge.userId.toString()))
      .filter((item): item is string[] => item !== undefined)
      .flat();
    logger.debug(`GraphService: getPublicFollows followList:(${ followList })`);
    return followList;
  }

  /**
   * Posts a follow request from an actor to an object.
   * 
   * @param actorId - The ID of the actor.
   * @param objectId - The ID of the object.
   * @returns A Promise that resolves to void.
   */
  public async postFollow(actorId: string, objectId: number): Promise<void> {
    logger.debug(`Follow Request: actorId:(${actorId}), objectId:(${objectId})`);
    const providerGraphDto: ProviderGraphDto = {
      dsnpId: actorId,
      connections: {
        data: [
          {
            dsnpId: objectId.toString(),
            privacyType: 'public',
            direction: 'connectionTo',
            connectionType: 'follow',
          },
        ],
      },
    };
    const resp = await this.client.ApiController_updateGraph(null, providerGraphDto);
    // Here we get the reference Id from the BullMQ worker queue
    // We can setup a webhook to listen for the response when the block with this txn is finalized
    // REMOVE: For now we will just assume that the transaction is successful in about 14 seconds
    logger.debug(`REMOVE: DEBUG: Follow Response: resp:(${JSON.stringify(resp.data)})`);
  }

  public async postUnfollow(actorId: string, objectId: number): Promise<void> {
    logger.debug(`Unfollow Request: actorId:(${actorId}), objectId:(${objectId})`);
    const providerGraphDto: ProviderGraphDto = {
      dsnpId: actorId,
      connections: {
        data: [
          {
            dsnpId: objectId.toString(),
            privacyType: 'public',
            direction: 'disconnect',
            connectionType: 'follow',
          },
        ],
      },
    };
    const resp = await this.client.ApiController_updateGraph(null, providerGraphDto);
    // Here we get the reference Id from the BullMQ worker queue
    // We can setup a webhook to listen for the response when the block with this txn is finalized
    // REMOVE: For now we will just assume that the transaction is successful in about 14 seconds
    logger.debug(`REMOVE: DEBUG: Unfollow Response: resp:( ${JSON.stringify(resp.data)} )`);
  }
}
