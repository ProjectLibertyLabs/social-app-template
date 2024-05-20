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
      console.log('Error parsing page', e);
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
    const followList: string[] = userGraphDto
      .map((userGraph) => userGraph.dsnpGraphEdges?.map((edge) => edge.userId.toString()))
      .filter((item): item is string[] => item !== undefined)
      .flat();
    logger.debug(`GraphService: getPublicFollows followList:(${ followList })`);
    return followList;
  }

  public async follow(actorId: string, objectId: number): Promise<void> {
    console.log('Follow Request', { actorId, objectId });
    const api = await getApi();
    const schemaId = getSchemaId(AnnouncementType.PublicFollows);
    const resp = await api.rpc.statefulStorage.getPaginatedStorage(actorId, schemaId);

    const pages = resp.map((page) => page.toJSON());

    const followPages = pages.map((page) => {
      try {
        return this.inflatePage(page.payload).map((x: GraphEdge) => x.userId);
      } catch (e) {
        console.error('Failed to parse public follows...', e);
        return [];
      }
    });

    for (const page of followPages) {
      if (page.includes(objectId)) {
        return;
      }
    }

    let pageNumber = pages.length - 1;

    let upsertEdges: GraphEdge[] = [];
    let hash = null;

    // Check if we should use a new page
    if (pageNumber === -1 || followPages[pageNumber].length >= 93) {
      pageNumber = pageNumber >= 0 ? pageNumber + 1 : 0;
    } else {
      const lastPage = pages[pageNumber];
      upsertEdges = this.inflatePage(lastPage.payload);
      hash = lastPage.content_hash;
    }

    upsertEdges.push({
      userId: objectId,
      since: Math.floor(Date.now() / 1000),
    });
    console.log('upsertEdges', upsertEdges);

    const encodedPage = this.deflatePage(upsertEdges);
    const payload = '0x' + encodedPage.toString('hex');

    const tx = api.tx.statefulStorage.upsertPage(actorId, schemaId, pageNumber, hash, payload);
    // Do NOT wait for all the callbacks. Assume for now that it will work...
    await api.tx.frequencyTxPayment
      .payWithCapacity(tx)
      .signAndSend(getProviderKey(), { nonce: await getNonce() }, ({ status, dispatchError }) => {
        if (dispatchError) {
          console.error('Graph ERROR: ', dispatchError.toHuman());
        } else if (status.isInBlock || status.isFinalized) {
          console.log('Graph Updated: ', status.toHuman());
        }
      });
  }

  public async unfollow(actorId: string, objectId: number): Promise<void> {
    console.log('Unfollow Request', { actorId, objectId });
    const api = await getApi();
    const schemaId = getSchemaId(AnnouncementType.PublicFollows);
    const resp = await api.rpc.statefulStorage.getPaginatedStorage(actorId, schemaId);

    const pages = resp.map((page) => page.toJSON());

    const followPages = pages.map((page) => {
      try {
        return this.inflatePage(page.payload).map((x: GraphEdge) => x.userId);
      } catch (e) {
        console.error('Failed to parse public follows...', e);
        return [];
      }
    });

    const pageNumber = followPages.findIndex((page) => page.includes(objectId));

    if (pageNumber < 0) return;

    // Check if we should use a new page
    const editPage = pages[pageNumber];
    const originalEdges = this.inflatePage(editPage.payload);
    const hash = editPage.content_hash;

    const upsertEdges = originalEdges.filter(({ userId }) => userId !== objectId);
    console.log('upsertEdges', upsertEdges, 'Length Difference: ', originalEdges.length - upsertEdges.length);

    const encodedPage = this.deflatePage(upsertEdges);
    const payload = '0x' + encodedPage.toString('hex');

    const tx = api.tx.statefulStorage.upsertPage(actorId, schemaId, pageNumber, hash, payload);
    // Do NOT wait for all the callbacks. Assume for now that it will work...
    await api.tx.frequencyTxPayment
      .payWithCapacity(tx)
      .signAndSend(getProviderKey(), { nonce: await getNonce() }, ({ status, dispatchError }) => {
        if (dispatchError) {
          console.error('Graph ERROR: ', dispatchError.toHuman());
        } else if (status.isInBlock || status.isFinalized) {
          console.log('Graph Updated: ', status.toHuman());
        }
      });
  }
}
