import type * as T from '../types/openapi.js';
import axios from 'axios';
import * as ContentRepository from '../repositories/ContentRepository';
import {
  AnnouncementResponse,
  AnnouncementType,
  BroadcastAnnouncement,
  ReplyAnnouncement,
} from '../types/content-announcement';
import logger from '../logger.js';
import { translateContentUrl } from '../utils/url-transation.js';
import { Components } from '../types/api';

export type Post = T.Components.Schemas.BroadcastExtended;
interface CachedPosts {
  [blockNumber: number]: [number, Post][];
}
interface CachedReplies {
  [blockNumber: number]: [number, any][];
}

type BlockRange = { from: number; to: number };

async function getPostsWithRepliesForBlockRange({ from, to }: BlockRange): Promise<[number, Post][]> {
  const postMessages = ContentRepository.get({
    blockFrom: from,
    blockTo: to,
    announcementTypes: [AnnouncementType.Broadcast],
  });

  // const replyMessages = ContentRepository.get({
  //   blockFrom: from,
  //   blockTo: to,
  //   announcementTypes: [AnnouncementType.Reply],
  // });

  // const replies: [number, any][] = [];
  // // Fetch the parquet files
  // for (const msg of replyMessages) {
  //   const reply = await getReplyContent(msg);
  //   if (reply) {
  //     replies.push(reply);
  //   }
  // }

  const postsWithReplies: [number, Post][] = [];
  // Fetch the parquet files
  for (const msg of postMessages) {
    const post = await getPostContent(msg);
    if (post) {
      postsWithReplies.push(post);
    }
  }

  // Return the posts
  return postsWithReplies;
}

// async function getRepliesForBlockRange({ from, to }: BlockRange): Promise<[number, any][]> {
//   const messages = ContentRepository.get({
//     blockFrom: from,
//     blockTo: to,
//     announcementTypes: [AnnouncementType.Reply],
//   });
//   logger.debug({messages}, `getRepliesForBlockRange messages`);
//
//   const replies: [number, any][] = [];
//   // Fetch the parquet files
//   for (const msg of messages) {
//     const reply = await getReplyContent(msg);
//     logger.debug({reply}, "getRepliesForBlockRange reply");
//     if (reply) {
//       replies.push(reply);
//     }
//   }

// Return the replies
//   return replies;
// }

async function getRepliesForPost(allReplies: [number, any][], contentHash: Post['contentHash']) {
  logger.debug({ allReplies }, 'getRepliesForPost allReplies');

  const repliesForPost: [number, any][] = [];
  for (const blockNumber in allReplies) {
    const replyObj = allReplies[blockNumber];
    logger.debug({ replyObj }, 'getRepliesForPost replyObj');

    const nestedObject: string = replyObj[1].inReplyTo;
    logger.debug({ nestedObject }, 'getRepliesForPost nestedObject.inReplyTo');
    logger.debug({ contentHash }, 'contentHash');

    const isGood = nestedObject.endsWith(contentHash);
    logger.debug({ isGood }, 'getRepliesForPost isGood');

    if (nestedObject.endsWith(contentHash)) {
      repliesForPost.push(replyObj[1]);
    }
  }
  return repliesForPost;
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
        replies: [],
      },
    ];
  } catch (err) {
    // Skip this announcement
    // TODO: Try again sometime?
    logger.error({ err }, 'Failed to fetch content');
    return undefined;
  }
}

// async function getReplyContent(msg: AnnouncementResponse): Promise<[number, any] | undefined> {
//   try {
//     const announcement = msg.announcement as ReplyAnnouncement;
//     // TODO: Validate Hash
//     const replyResp = await axios.get(translateContentUrl(announcement.url), {
//       responseType: 'text',
//       timeout: 10000,
//     });
//
//     return [
//       msg.blockNumber,
//       {
//         fromId: announcement.fromId,
//         contentHash: announcement.contentHash,
//         inReplyTo: announcement.inReplyTo,
//         content: replyResp.data as string,
//         timestamp: new Date().toISOString(), // TODO: Use Block timestamp
//       },
//     ];
//   } catch (err) {
//     // Skip this announcement
//     // TODO: Try again sometime?
//     logger.error({ err }, 'Failed to fetch reply content');
//     return undefined;
//   }
// }

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

export async function fetchAndCachePostsWithReplies(
  newestBlockNumber: number,
  oldestBlockNumber: number
): Promise<void> {
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
    const posts = await getPostsWithRepliesForBlockRange(range);
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

// Object map
const cachedPosts: CachedPosts = {};
// const cachedReplies: CachedReplies = {};

export async function getPostsInRange(newestBlockNumber: number, oldestBlockNumber: number): Promise<Post[]> {
  // Trigger the fetch and caching
  await fetchAndCachePostsWithReplies(newestBlockNumber, oldestBlockNumber);

  const posts: Post[] = [];
  for (let i = newestBlockNumber; i >= oldestBlockNumber; i--) {
    const blockPosts = (cachedPosts?.[i] || []).map(([_x, p]) => p);
    posts.push(...blockPosts);
  }
  logger.debug({ newestBlockNumber, oldestBlockNumber, posts }, 'getPostsInRange - posts');
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
