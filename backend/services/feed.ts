import type * as T from '../types/openapi.js';
import axios from 'axios';
import * as ContentRepository from '../repositories/ContentRepository';
import {
  AnnouncementResponse,
  AnnouncementType,
  BroadcastAnnouncement,
  ReplyAnnouncement
} from '../types/content-announcement';
import logger from '../logger.js';
import { translateContentUrl } from '../utils/url-transation.js';

export type Post = T.Components.Schemas.BroadcastExtended;
interface CachedPosts {
  [blockNumber: number]: [number, Post][];
}
interface CachedReplies {
  [blockNumber: number]: [number, any][];
}

type BlockRange = { from: number; to: number };

async function getPostsForBlockRange({ from, to }: BlockRange): Promise<[number, Post][]> {
  const messages = ContentRepository.get({
    blockFrom: from,
    blockTo: to,
    announcementTypes: [AnnouncementType.Broadcast],
  });

  const posts: [number, Post][] = [];
  // Fetch the parquet files
  for (const msg of messages) {
    const post = await getPostContent(msg);
    if (post) {
      posts.push(post);
    }
  }

  // Return the posts
  return posts;
}

async function getRepliesForBlockRange({ from, to }: BlockRange): Promise<[number, any][]> {
  const messages = ContentRepository.get({
    blockFrom: from,
    blockTo: to,
    announcementTypes: [AnnouncementType.Reply],
  });
  logger.debug({messages}, `getRepliesForBlockRange messages`);

  const replies: [number, any][] = [];
  // Fetch the parquet files
  for (const msg of messages) {
    const reply = await getReplyContent(msg);
    logger.debug({reply}, "getRepliesForBlockRange reply");
    if (reply) {
      replies.push(reply);
    }
  }

  // Return the replies
  return replies;
}

async function getRepliesForPost(contentHash: Post['contentHash']) {
  // logger.debug({cachedReplies}, "getRepliesForPost cachedReplies");
  const cachedRepliesLocal: CachedReplies = {
   "847969": [
    [
      847969,
      {
        fromId: 6400,
         contentHash: "z4JyWUsG7do8Z8fQvjUP3V1ofjvbeZ9VQdLTJg4YhbKubGGvdiftWarcgp3WtadR5Eds29QDiwGxyk",
         inReplyTo: "dsnp://6400/f7a387a666654426b36726159595a6634413551476e7a76466d44734b444178613452654d456a4e36594a4a6f596472653566527054527945",
         content: "{\"@context\":\"https://www.w3.org/ns/activitystreams\",\"type\":\"Note\",\"mediaType\":\"text/plain\",\"published\":\"2024-07-22T23:25:39.680Z\",\"content\":\"reply!\",\"location\":null,\"tag\":[],\"attachment\":[]}",
         timestamp: "2024-07-23T02:15:38.843Z"
      }
    ]
   ]
  }

  if (Object.keys(cachedRepliesLocal).length === 0) return [];

  for (const blockNumber in cachedRepliesLocal) {
    const blockArray = cachedRepliesLocal[blockNumber];

    for (const item of blockArray) {
      logger.debug({item}, "getRepliesForPost item");

      const nestedObject: string = item[1].inReplyTo;
      logger.debug({nestedObject}, "getRepliesForPost nestedObject.inReplyTo");
      logger.debug({contentHash}, "contentHash");

      const isGood = nestedObject.endsWith(contentHash);
      logger.debug({isGood}, "getRepliesForPost isGood");


      if (nestedObject.endsWith("f7a387a666654426b36726159595a6634413551476e7a76466d44734b444178613452654d456a4e36594a4a6f596472653566527054527945")) {
        return item;
      }
    }
  }

  return []; // If no matching item is found

  // // need to check that reply did not come before post using block numbers.
  // logger.debug(`****getRepliesForPost: ${contentHash}`);
  // const allContentBlocks = ContentRepository.get({ announcementTypes: [AnnouncementType.Reply] }).map(
  //   (ann) => ann.blockNumber
  // );
  //
  // if (!allContentBlocks || !allContentBlocks.length) {
  //   logger.error({ contentHash, announcementTypes: [AnnouncementType.Reply] }, 'getRepliesForPost: No content found');
  //   return [];
  // }
  //
  // const minBlock = Math.min(...allContentBlocks);
  // const maxBlock = Math.max(...allContentBlocks);
  //
  // const allReplies = await getRepliesInRange(minBlock, maxBlock) as any;
  // logger.debug({allReplies}, `*****ALL REPLIES`);
  //
  // // @ts-ignore
  // const repliesForPostContains = allReplies.find((r: any) => r?.inRelyTo?.contains(contentHash));
  // const repliesForPostEndsWith = (cachedReplies as any).find((r: any) => r?.inRelyTo?.endsWith(contentHash));
  // logger.debug(`*****HERE repliesForPostContains: ${JSON.stringify(repliesForPostContains || {})}`);
  // logger.debug(`*****HERE repliesForPostEndsWith: ${JSON.stringify(repliesForPostEndsWith || {})}`);


  // return repliesForPostEndsWith;
}

async function getPostContent(msg: AnnouncementResponse): Promise<[number, Post] | undefined> {
  try {
    const announcement = msg.announcement as BroadcastAnnouncement;
    // TODO: Validate Hash
    const postResp = await axios.get(translateContentUrl(announcement.url), {
      responseType: 'text',
      timeout: 10000,
    });

    const replies = await getRepliesForPost(announcement.contentHash);
    logger.debug("*** FEED REPLIES ***", replies);

    return [
      msg.blockNumber,
      {
        fromId: announcement.fromId,
        contentHash: announcement.contentHash,
        content: postResp.data as string,
        timestamp: new Date().toISOString(), // TODO: Use Block timestamp
        replies: replies,
      },
    ];
  } catch (err) {
    // Skip this announcement
    // TODO: Try again sometime?
    logger.error({ err }, 'Failed to fetch content');
    return undefined;
  }
}

async function getReplyContent(msg: AnnouncementResponse): Promise<[number, any] | undefined> {
  try {
    const announcement = msg.announcement as ReplyAnnouncement;
    // TODO: Validate Hash
    const replyResp = await axios.get(translateContentUrl(announcement.url), {
      responseType: 'text',
      timeout: 10000,
    });

    logger.debug(`announcement announcement: ${announcement}`);
    return [
      msg.blockNumber,
      {
        fromId: announcement.fromId,
        contentHash: announcement.contentHash,
        inReplyTo: announcement.inReplyTo,
        content: replyResp.data as string,
        timestamp: new Date().toISOString(), // TODO: Use Block timestamp
      },
    ];
  } catch (err) {
    // Skip this announcement
    // TODO: Try again sometime?
    logger.error({ err }, 'Failed to fetch reply content');
    return undefined;
  }
}

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

export async function fetchAndCachePosts(newestBlockNumber: number, oldestBlockNumber: number): Promise<void> {
  // Create the range
  const ranges = Array.from(
    { length: Math.abs(newestBlockNumber - oldestBlockNumber) + 1 },
    (_x, i) => oldestBlockNumber + i
  )
    // Skip those already in the cache
    .filter((x) => !(x in cachedPosts))
    // Create ranges
    // TODO: Handle single block requests
    .reduce(toRanges, []);

  for (const range of ranges) {
    // Cache the posts for each range and apply to the cache
    const posts = await getPostsForBlockRange(range);
    for (let i = range.from; i <= range.to; i++) {
      const blockPosts = posts.filter(([n]) => n === i);
      // Do not cache empty blocks
      // Post announcements (a trigger for storing content) can come after the block is initially fetched.
      // If cached while empty, the new posts will not be found and then not show in the feed.
      if (blockPosts.length > 0) {
        cachedPosts[i] = blockPosts;
      }
    }
  }
}

export async function fetchAndCacheReplies(newestBlockNumber: number, oldestBlockNumber: number): Promise<void> {
  // Create the range
  const ranges = Array.from(
    { length: Math.abs(newestBlockNumber - oldestBlockNumber) + 1 },
    (_x, i) => oldestBlockNumber + i
  )
    // Skip those already in the cache
    .filter((x) => !(x in cachedReplies))
    // Create ranges
    // TODO: Handle single block requests
    .reduce(toRanges, []);
  logger.debug({ranges}, "here ranges");


  for (const range of ranges) {
    // Cache the posts for each range and apply to the cache
    const replies = await getRepliesForBlockRange(range);
    logger.debug({replies}, "here replies");
    for (let i = range.from; i <= range.to; i++) {
      const blockReplies = replies.filter(([n]) => n === i);
      // Do not cache empty blocks
      // Post announcements (a trigger for storing content) can come after the block is initially fetched.
      // If cached while empty, the new posts will not be found and then not show in the feed.
      if (blockReplies.length > 0) {
        cachedReplies[i] = blockReplies;
      }
    }
  }
}

// Object map
const cachedPosts: CachedPosts = {};
const cachedReplies: CachedReplies = {};

export async function getPostsInRange(newestBlockNumber: number, oldestBlockNumber: number): Promise<Post[]> {
  // Trigger the fetch and caching
  // await fetchAndCacheReplies(newestBlockNumber, oldestBlockNumber);
  await fetchAndCachePosts(newestBlockNumber, oldestBlockNumber);
  logger.debug({cachedReplies}, 'cachedReplies***')

  const posts: Post[] = [];
  for (let i = newestBlockNumber; i >= oldestBlockNumber; i--) {
    const blockPosts = (cachedPosts?.[i] || []).map(([_x, p]) => p);
    posts.push(...blockPosts);
  }
  logger.debug({ newestBlockNumber, oldestBlockNumber, posts }, 'getPostsInRange');
  return posts;
}

export async function getRepliesInRange(newestBlockNumber: number, oldestBlockNumber: number): Promise<any[]> {
  // Trigger the fetch and caching
  await fetchAndCacheReplies(newestBlockNumber, oldestBlockNumber);

  const replies: any[] = [];
  for (let i = newestBlockNumber; i >= oldestBlockNumber; i--) {
    const blockReplies = (cachedReplies?.[i] || []).map(([_x, p]) => p);
    replies.push(...blockReplies);
  }
  logger.debug({ newestBlockNumber, oldestBlockNumber, replies }, 'getRepliesInRange');
  return replies;
}

export async function getSpecificContent(msaId: string, contentHash: string): Promise<Post | undefined> {
  // const post = (Object.values(cache) as [number, Post][]).flatMap(([_, p]) => p).find((p) => p.contentHash === contentHash && p.fromId === msaId);
  const allContentBlocks = ContentRepository.get({ msaIds: [msaId], contentHash }).map((ann) => ann.blockNumber);
  if (!allContentBlocks || !allContentBlocks.length) {
    logger.error({ msaId, contentHash }, 'getSpecificContent: No content found');
    return undefined;
  }

  const minBlock = Math.min(...allContentBlocks);
  const maxBlock = Math.max(...allContentBlocks);

  const allPosts = await getPostsInRange(minBlock, maxBlock);

  return allPosts.find((p) => p.fromId === msaId && p.contentHash === contentHash);
}
