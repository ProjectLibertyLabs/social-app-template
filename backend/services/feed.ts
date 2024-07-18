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

  const posts: [number, Post][] = [];
  // Fetch the parquet files
  for (const msg of messages) {
    const post = await getReplyContent(msg);
    if (post) {
      posts.push(post);
    }
  }

  // Return the posts
  return posts;
}

async function getRepliesForPost(contentHash: Post['contentHash']): Promise<any[]> {
  // need to check that reply did not come before post using block numbers.
  logger.debug("****HELLO WORLD!!!", contentHash);
  const allContentBlocks = ContentRepository.get({ announcementTypes: [AnnouncementType.Reply] }).map(
    (ann) => ann.blockNumber
  );
  logger.debug("*****HERE REPLIES", allContentBlocks);

  if (!allContentBlocks || !allContentBlocks.length) {
    logger.error({ contentHash, announcementTypes: [AnnouncementType.Reply] }, 'getRepliesForPost: No content found');
    return [];
  }

  const minBlock = Math.min(...allContentBlocks);
  const maxBlock = Math.max(...allContentBlocks);

  const allReplies = await getRepliesInRange(minBlock, maxBlock) as any;
  logger.debug("*****ALL REPLIES", allReplies);

  // @ts-ignore
  const repliesForPostIncludes = allReplies.find((r) => r.inRelyTo.includes(contentHash));
  const repliesForPostContains = allReplies.find((r: any) => r.inRelyTo.contains(contentHash));
  const repliesForPostEndsWith = allReplies.find((r: any) => r.inRelyTo.endsWith(contentHash));
  logger.debug("*****HERE repliesForPost", repliesForPostIncludes);
  logger.debug("*****HERE repliesForPostContains", repliesForPostContains);
  logger.debug("*****HERE repliesForPostEndsWith", repliesForPostEndsWith);

  return repliesForPostEndsWith;
}

async function getPostContent(msg: AnnouncementResponse): Promise<[number, Post] | undefined> {
  try {
    const announcement = msg.announcement as BroadcastAnnouncement;
    // TODO: Validate Hash
    const postResp = await axios.get(translateContentUrl(announcement.url), {
      responseType: 'text',
      timeout: 10000,
    });
    return [
      msg.blockNumber,
      {
        fromId: announcement.fromId,
        contentHash: announcement.contentHash,
        content: postResp.data as string,
        timestamp: new Date().toISOString(), // TODO: Use Block timestamp
        replies: await getRepliesForPost(announcement.contentHash), // TODO: Support replies
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
    const postResp = await axios.get(translateContentUrl(announcement.url), {
      responseType: 'text',
      timeout: 10000,
    });
    return [
      msg.blockNumber,
      {
        fromId: announcement.fromId,
        contentHash: announcement.contentHash,
        inReplyTo: announcement.inReplyTo,
        content: postResp.data as string,
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
    .filter((x) => !(x in cache))
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
        cache[i] = blockPosts;
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
    .filter((x) => !(x in cache))
    // Create ranges
    // TODO: Handle single block requests
    .reduce(toRanges, []);

  for (const range of ranges) {
    // Cache the posts for each range and apply to the cache
    const posts = await getRepliesForBlockRange(range);
    for (let i = range.from; i <= range.to; i++) {
      const blockPosts = posts.filter(([n]) => n === i);
      // Do not cache empty blocks
      // Post announcements (a trigger for storing content) can come after the block is initially fetched.
      // If cached while empty, the new posts will not be found and then not show in the feed.
      if (blockPosts.length > 0) {
        cache[i] = blockPosts;
      }
    }
  }
}

// Object map
const cache: CachedPosts = {};

export async function getPostsInRange(newestBlockNumber: number, oldestBlockNumber: number): Promise<Post[]> {
  // Trigger the fetch and caching
  await fetchAndCachePosts(newestBlockNumber, oldestBlockNumber);

  const posts: Post[] = [];
  for (let i = newestBlockNumber; i >= oldestBlockNumber; i--) {
    const blockPosts = (cache?.[i] || []).map(([_x, p]) => p);
    posts.push(...blockPosts);
  }
  logger.debug({ newestBlockNumber, oldestBlockNumber, posts }, 'getPostsInRange');
  return posts;
}

export async function getRepliesInRange(newestBlockNumber: number, oldestBlockNumber: number): Promise<any[]> {
  // Trigger the fetch and caching
  await fetchAndCacheReplies(newestBlockNumber, oldestBlockNumber);

  const posts: Post[] = [];
  for (let i = newestBlockNumber; i >= oldestBlockNumber; i--) {
    const blockPosts = (cache?.[i] || []).map(([_x, p]) => p);
    posts.push(...blockPosts);
  }
  logger.debug({ newestBlockNumber, oldestBlockNumber, posts }, 'getRepliesInRange');
  return posts;
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
