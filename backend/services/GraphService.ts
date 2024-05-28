import zlib from 'node:zlib';
import { getSchemaId } from './announce.js';
import { getApi, getNonce, getProviderKey } from './frequency.js';
import { dsnp } from '@dsnp/frequency-schemas';
import avro from 'avro-js';
import { AnnouncementType } from '../types/content-announcement';
import logger from '../logger.js';

// TODO: Remove all graph logic in favor of proxy to `graph-service`

// { userId, since }
const publicFollowsAvro = avro.parse(dsnp.userPublicFollows.types[0]);
// { compressedPublicGraph: bytes }
const publicFollowsCompressed = avro.parse(dsnp.userPublicFollows);

interface GraphEdge {
  userId: number;
  since: number;
}

export class GraphService {
  private static _instance: GraphService;

  private constructor() {}

  public static async instance() {
    if (!this._instance) {
      this._instance = new this();
    }

    return this._instance;
  }

  private inflatePage(payload: string): GraphEdge[] {
    if (!payload) return [];
    try {
      const buf = Buffer.from(payload.substring(2), 'hex');
      const container = publicFollowsCompressed.fromBuffer(buf);
      const data = zlib.inflateSync(container.compressedPublicGraph);
      const graphEdges = publicFollowsAvro.fromBuffer(data);
      return graphEdges;
    } catch (err) {
      logger.error({ err }, 'Error parsing page');
      return [];
    }
  }

  private deflatePage(edges: GraphEdge[]) {
    const inside = publicFollowsAvro.toBuffer(edges);
    const compressedPublicGraph = zlib.deflateSync(inside);
    return publicFollowsCompressed.toBuffer({ compressedPublicGraph });
  }

  public async getPublicFollows(msaId: string): Promise<string[]> {
    const api = await getApi();
    const schemaId = getSchemaId(AnnouncementType.PublicFollows);
    const resp = await api.rpc.statefulStorage.getPaginatedStorage(msaId, schemaId);
    const followList = resp.flatMap((page) => {
      try {
        return this.inflatePage(page.toJSON().payload).map((x: { userId: number; since: number }) =>
          x.userId.toString()
        );
      } catch (err) {
        logger.error({ err }, 'Failed to parse public follows');
        return [];
      }
    });

    return followList;
  }

  public async follow(actorId: string, objectId: number): Promise<void> {
    logger.info({ actorId, objectId }, 'Follow Request');
    const api = await getApi();
    const schemaId = getSchemaId(AnnouncementType.PublicFollows);
    const resp = await api.rpc.statefulStorage.getPaginatedStorage(actorId, schemaId);

    const pages = resp.map((page) => page.toJSON());

    const followPages = pages.map((page) => {
      try {
        return this.inflatePage(page.payload).map((x: GraphEdge) => x.userId);
      } catch (err) {
        logger.error({ err }, 'Failed to parse public follows');
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
    logger.debug(upsertEdges, 'upsertEdges');

    const encodedPage = this.deflatePage(upsertEdges);
    const payload = '0x' + encodedPage.toString('hex');

    const tx = api.tx.statefulStorage.upsertPage(actorId, schemaId, pageNumber, hash, payload);
    // Do NOT wait for all the callbacks. Assume for now that it will work...
    await api.tx.frequencyTxPayment
      .payWithCapacity(tx)
      .signAndSend(getProviderKey(), { nonce: await getNonce() }, ({ status, dispatchError }) => {
        if (dispatchError) {
          logger.error(dispatchError.toJSON(), 'Graph ERROR');
        } else if (status.isInBlock || status.isFinalized) {
          logger.info(status.toJSON(), 'Graph Updated');
        }
      });
  }

  public async unfollow(actorId: string, objectId: number): Promise<void> {
    logger.info({ actorId, objectId }, 'Unfollow Request');
    const api = await getApi();
    const schemaId = getSchemaId(AnnouncementType.PublicFollows);
    const resp = await api.rpc.statefulStorage.getPaginatedStorage(actorId, schemaId);

    const pages = resp.map((page) => page.toJSON());

    const followPages = pages.map((page) => {
      try {
        return this.inflatePage(page.payload).map((x: GraphEdge) => x.userId);
      } catch (err) {
        logger.error({ err }, 'Failed to parse public follows');
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
    logger.debug(`upsertEdges: ${upsertEdges} Length Difference: ${originalEdges.length - upsertEdges.length}`);

    const encodedPage = this.deflatePage(upsertEdges);
    const payload = '0x' + encodedPage.toString('hex');

    const tx = api.tx.statefulStorage.upsertPage(actorId, schemaId, pageNumber, hash, payload);
    // Do NOT wait for all the callbacks. Assume for now that it will work...
    await api.tx.frequencyTxPayment
      .payWithCapacity(tx)
      .signAndSend(getProviderKey(), { nonce: await getNonce() }, ({ status, dispatchError }) => {
        if (dispatchError) {
          logger.error(dispatchError.toJSON(), 'Graph ERROR');
        } else if (status.isInBlock || status.isFinalized) {
          logger.info(status.toJSON(), 'Graph Updated');
        }
      });
  }
}
