import type * as T from "../types/openapi.js";
import { getSchemaId } from "./announce.js";
import { AnnouncementType, BroadcastAnnouncement } from "./dsnp.js";
import { getApi } from "./frequency.js";
import { bases } from "multiformats/basics";
import { hexToString } from "@polkadot/util";
import axios from "axios";
import { ParquetReader } from "@dsnp/parquetjs";
import { MessageResponse } from "@frequency-chain/api-augment/interfaces";
import { ipfsUrl } from "./ipfs.js";

type Post = T.Components.Schemas.BroadcastExtended;
interface CachedPosts {
  [blockNumber: number]: Promise<[number, Post][]>;
}

type BlockRange = { from: number; to: number };

interface MsgParsed {
  cid: string;
  provider_msa_id: number;
  msa_id: number | null;
  index: number;
  block_number: number;
  payload_length: number;
}

const getPostsForBlockRange = async ({
  from,
  to,
}: BlockRange): Promise<[number, Post][]> => {
  // Get the events from the block
  const api = await getApi();
  const schemaId = getSchemaId(AnnouncementType.Broadcast);

  // TODO: Support when > 10_000 messages come back
  // TODO: to_block - self.from_block <= 50000
  const resp = await api.rpc.messages.getBySchemaId(schemaId, {
    from_block: from, // Inclusive
    from_index: 0,
    to_block: to + 1, // Exclusive
    page_size: 10_000,
  });

  const messages: MsgParsed[] = resp.content.map((msg: any) => {
    const parsed = msg.toJSON() as unknown as MessageResponse;
    return {
      ...parsed,
      cid: hexToString(parsed.cid as any),
    };
  });

  const posts: [number, Post][] = [];
  // Fetch the parquet files
  for await (const msg of messages) {
    try {
      const parquetFileUrl = ipfsUrl(msg.cid);
      const resp = await axios.get(parquetFileUrl, {
        responseType: "arraybuffer",
        timeout: 10_000,
      });

      const reader = await ParquetReader.openBuffer(Buffer.from(resp.data));
      // Fetch the individual posts
      const cursor = reader.getCursor();
      let announcement: null | BroadcastAnnouncement = null;
      while (
        (announcement = (await cursor.next()) as null | BroadcastAnnouncement)
      ) {
        try {
          // TODO: Validate Hash
          const postResp = await axios.get(announcement.url, {
            responseType: "text",
            timeout: 10_000,
          });
          posts.push([
            msg.block_number,
            {
              fromId: announcement.fromId.toString(),
              contentHash: bases.base58btc.encode(
                announcement.contentHash as any,
              ),
              content: postResp.data as unknown as string,
              timestamp: new Date().toISOString(), // TODO: Use Block timestamp
              replies: [], // TODO: Support replies
            },
          ]);
        } catch (e) {
          // Skip this announcement
          // TODO: Try again sometime?
          console.error("Failed Content", e);
        }
      }
    } catch (e) {
      // Skip this parquet file.
      // TODO: Try again sometime?
      console.error("Failed Parquet File", e);
      return [];
    }
  }

  // Return the posts
  return posts;
};

const toRanges = (prev: BlockRange[], cur: number): BlockRange[] => {
  if (!prev[0]) {
    return [
      {
        from: cur,
        to: cur,
      },
    ];
  }
  const priorTo = prev[0].to;
  if (priorTo === cur || priorTo + 1 === cur) {
    prev[0].to = cur;
  } else {
    prev.unshift({ from: cur, to: cur });
  }
  return prev;
};

const fetchAndCachePosts = (
  newestBlockNumber: number,
  oldestBlockNumber: number,
): void => {
  // Create the range
  Array.from(
    { length: Math.abs(newestBlockNumber - oldestBlockNumber) + 1 },
    (_x, i) => oldestBlockNumber + i,
  )
    // Skip those already in the cache
    .filter((x) => !(x in cache))
    // Create ranges
    .reduce(toRanges, [])
    // TODO: Handle single block requests
    // Cache the posts for each range and apply to the cache
    .map((range) => {
      const pending = getPostsForBlockRange(range);
      for (let i = range.from; i <= range.to; i++) {
        cache[i] = pending.then((x) => x.filter(([n]) => n === i));
      }
    });
};

const cache: CachedPosts = {};

export const getPostsInRange = async (
  newestBlockNumber: number,
  oldestBlockNumber: number,
): Promise<Post[]> => {
  // Trigger the fetch and caching
  fetchAndCachePosts(newestBlockNumber, oldestBlockNumber);

  const posts: Post[] = [];
  for (let i = newestBlockNumber; i >= oldestBlockNumber; i--) {
    const blockPosts = ((await cache[i]) || []).map(([_x, p]) => p);
    posts.push(...blockPosts);
  }
  return posts;
};
