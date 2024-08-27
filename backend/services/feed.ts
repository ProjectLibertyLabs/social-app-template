import type * as T from '../types/openapi.js';
import axios from 'axios';
import { AnnouncementEntity, ContentRepository } from '../repositories/ContentRepository';
import {
  AnnouncementResponse,
  AnnouncementType,
  BroadcastAnnouncement,
  ReplyAnnouncement,
} from '../types/content-announcement';
import logger from '../logger.js';
import { translateContentUrl } from '../utils/url-transation.js';

export type Post = T.Components.Schemas.BroadcastExtended;
export type Reply = T.Components.Schemas.ReplyExtended;

type BlockRange = { from: number; to: number };

function toPost(entity: AnnouncementEntity): Post {
  const broadcast = entity.announcement.announcement as BroadcastAnnouncement;
  return {
    fromId: broadcast.fromId,
    contentHash: broadcast.contentHash,
    content: JSON.stringify(entity.content),
    timestamp: new Date().toISOString(),
  };
}

function toReply(entity: AnnouncementEntity): Reply {
  const reply = entity.announcement.announcement as ReplyAnnouncement;
  return {
    fromId: reply.fromId,
    contentHash: reply.contentHash,
    content: JSON.stringify(entity.content),
    timestamp: new Date().toISOString(),
  };
}

async function getPostsForBlockRange({ from, to }: BlockRange): Promise<Post[]> {
  const announcements = ContentRepository.getAnnouncementsWithContent({
    blockFrom: from,
    blockTo: to,
    announcementTypes: [AnnouncementType.Broadcast],
  });

  const posts: Post[] = [];
  // Fetch the parquet files
  for (const msg of announcements) {
    const post = await getPostContent(msg);
    if (post) {
      posts.push(post);
    }
  }

  // Return the posts
  return posts;
}

async function getPostContent(msg: AnnouncementEntity): Promise<Post | undefined> {
  try {
    const broadcastAnnouncement = msg.announcement.announcement as BroadcastAnnouncement;
    // TODO: Validate Hash
    let rawContent = msg.content;
    if (!rawContent) {
      const postResp = await axios.get(translateContentUrl(broadcastAnnouncement.url), {
        responseType: 'text',
        timeout: 10000,
      });
      rawContent = JSON.parse(postResp.data);
      msg.content = rawContent;
      ContentRepository.addContent(msg.key, rawContent);
    }
    const replyMessages = ContentRepository.getAnnouncementsWithContent({
      announcementTypes: [AnnouncementType.Reply],
      relatedContentHash: broadcastAnnouncement.contentHash.toString(),
    });
    const replies: Reply[] = await Promise.all(
      replyMessages.map(async (replyMessage): Promise<Reply> => {
        const replyAnnouncement = replyMessage.announcement.announcement as ReplyAnnouncement;
        if (!replyMessage?.content) {
          const replyResp = await axios.get(translateContentUrl(replyAnnouncement.url), {
            responseType: 'text',
            timeout: 10000,
          });
          const rawReplyContent = JSON.parse(replyResp.data);
          replyMessage.content = rawReplyContent;
          ContentRepository.addContent(replyMessage.key, rawReplyContent);
        }

        return toReply(replyMessage);
      })
    );

    return {
      ...toPost(msg),
      replies,
    };
  } catch (err) {
    // Skip this announcement
    // TODO: Try again sometime?
    logger.error({ err }, 'Failed to fetch content');
    return undefined;
  }
}

export async function getPostsInRange(newestBlockNumber: number, oldestBlockNumber: number): Promise<Post[]> {
  return getPostsForBlockRange({ from: oldestBlockNumber, to: newestBlockNumber });
}

export async function getSpecificContent(msaId: string, contentHash: string): Promise<Post | undefined> {
  // const post = (Object.values(cache) as [number, Post][]).flatMap(([_, p]) => p).find((p) => p.contentHash === contentHash && p.fromId === msaId);
  const allContentBlocks = ContentRepository.getAnnouncements({ msaIds: [msaId], contentHash }).map(
    (ann) => ann.blockNumber
  );
  if (!allContentBlocks || !allContentBlocks.length) {
    logger.error({ msaId, contentHash }, 'getSpecificContent: No content found');
    return undefined;
  }

  const minBlock = Math.min(...allContentBlocks);
  const maxBlock = Math.max(...allContentBlocks);

  const allPosts = await getPostsInRange(minBlock, maxBlock);

  return allPosts.find((p) => p.fromId === msaId && p.contentHash === contentHash);
}
