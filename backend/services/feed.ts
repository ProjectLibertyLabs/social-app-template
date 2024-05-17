import type * as T from "../types/openapi.js";
import axios from "axios";
import * as ContentRepository from "../repositories/ContentRepository";
import {
  AnnouncementType,
  BroadcastAnnouncement,
} from "../types/content-announcement";
import logger from "../logger.js";

type Post = T.Components.Schemas.BroadcastExtended;
interface CachedPosts {
  [blockNumber: number]: [number, Post][];
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

const getPostsForBlockRange = async ({ from, to }: BlockRange): Promise<[number, Post][]> => {
  const messages = ContentRepository.get({
    blockFrom: from,
    blockTo: to,
    announcementTypes: [AnnouncementType.Broadcast],
  });

  const posts: [number, Post][] = [];
  // Fetch the parquet files
  for (const msg of messages) {
    try {
      const announcement = msg.announcement as BroadcastAnnouncement;
      // TODO: Validate Hash
      const postResp = await axios.get(announcement.url, {
        responseType: "text",
        timeout: 10_000,
      });
      logger.debug(postResp, "Got post");
      posts.push([
        msg.blockNumber,
        {
          fromId: announcement.fromId,
          contentHash: announcement.contentHash,
          content: postResp.data as string,
          timestamp: new Date().toISOString(), // TODO: Use Block timestamp
          replies: [], // TODO: Support replies
        },
      ]);
    } catch (err) {
      // Skip this announcement
      // TODO: Try again sometime?
      logger.error({ err }, "Failed Content");
    }
  }

  // Return the posts
  logger.debug(posts, "Returning posts");
  return posts;
};

function toRanges(prev: BlockRange[], cur: number): BlockRange[] {
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
}

export async function fetchAndCachePosts(
  newestBlockNumber: number,
  oldestBlockNumber: number,
): Promise<void> {
  // Create the range
  const ranges = Array.from(
    { length: Math.abs(newestBlockNumber - oldestBlockNumber) + 1 },
    (_x, i) => oldestBlockNumber + i,
  )
    // Skip those already in the cache
    .filter((x) => !(x in cache))
    // Create ranges
    // TODO: Handle single block requests
    .reduce(toRanges, []);

  for (const range of ranges) {
    // Cache the posts for each range and apply to the cache
    const posts = await getPostsForBlockRange(range);
    for (let i = range.from; i <= range.to; i++) {
      cache[i] = posts.filter(([n]) => n === i);
    }
  }
}

const cache: CachedPosts = {};

export async function getPostsInRange(
  newestBlockNumber: number,
  oldestBlockNumber: number,
): Promise<Post[]> {
  // Trigger the fetch and caching
  await fetchAndCachePosts(newestBlockNumber, oldestBlockNumber);

  const posts: Post[] = [];
  for (let i = newestBlockNumber; i >= oldestBlockNumber; i--) {
    const blockPosts = (cache[i] || []).map(([_x, p]) => p);
    posts.push(...blockPosts);
  }
  return posts;
}
