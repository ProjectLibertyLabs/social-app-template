/** Content Repository
 *
 * Dummy service for caching content; replace with a persistence/cache layer of your choice.
 * This one is horribly inefficient and does not scale!
 */

import { createHash } from 'crypto';
import {
  type AnnouncementResponse,
  AnnouncementType,
  BroadcastAnnouncement,
  ReactionAnnouncement,
  ReplyAnnouncement,
} from '../types/content-announcement';
import '../types/content-announcement/type.augment';
import { isBroadcast, isProfile, isReply, isTombstone, isUpdate } from '../types/content-announcement/type.augment';
import logger from '../logger';

export type ContentSearchParametersType = {
  msaIds?: string[];
  schemaIds?: string[];
  announcementTypes?: AnnouncementType[];
  blockFrom?: number;
  blockTo?: number;
  contentHash?: string;
};

type ResponseAnnouncementResponse = AnnouncementResponse & { announcement: ReplyAnnouncement | ReactionAnnouncement };

// TODO: more tightly bind the announcement types. Reactions and replies only in contentResponseMap.
const contentMap = new Map<string, AnnouncementResponse>();
const contentResponseMap = new Map<string, ResponseAnnouncementResponse>();

function getContentHash(contentAnnouncement: AnnouncementResponse) {
  const { announcement } = contentAnnouncement;
  if (isBroadcast(announcement) || isProfile(announcement) || isReply(announcement) || isUpdate(announcement)) {
    return announcement.contentHash;
  } else if (isTombstone(announcement)) {
    return announcement.targetContentHash;
  } else {
    return createHash('sha256').update(JSON.stringify(announcement)).digest('base64url');
  }
}

function getKey(contentAnnouncement: AnnouncementResponse) {
  const hash = getContentHash(contentAnnouncement);
  const {
    blockNumber,
    announcement: { fromId },
  } = contentAnnouncement;

  return `${blockNumber}:${fromId}:${hash}`;
}

function getResponseKey(
  contentAnnouncement: ResponseAnnouncementResponse
): string {
  const responseInReplyTo = contentAnnouncement.announcement.inReplyTo;
  const parentContentHash = responseInReplyTo.split('/').pop();
  if (!parentContentHash) throw new Error('Invalid URI');
  return parentContentHash;
}

export function add(content: AnnouncementResponse) {
  switch (content.announcement.announcementType) {
    case AnnouncementType.Broadcast: {
      const key = getKey(content);
      contentMap.set(key, content);
      logger.debug({ key, content }, 'Storing broadcast content');
      break;
    }
    case AnnouncementType.Reply:
    case AnnouncementType.Reaction: {
      const key = getResponseKey(content as ResponseAnnouncementResponse);
      contentResponseMap.set(key, content as ResponseAnnouncementResponse);
      logger.debug({ key, content }, 'Storing response content');
      break;
    }
    default: {
      const key = getKey(content);
      contentMap.set(key, content);
      logger.debug({ key, content }, 'Storing broadcast content');
      break;
    }
  }
}

export function get(options?: ContentSearchParametersType): AnnouncementResponse[] {
  return [...contentMap.values()].filter((content) => {
    if (options) {
      if (options.schemaIds && !options.schemaIds.includes(content.schemaId.toString())) {
        return false;
      }

      if (options.announcementTypes && !options.announcementTypes.includes(content.announcement.announcementType)) {
        return false;
      }

      if (options.blockFrom !== undefined) {
        if (content.blockNumber < options.blockFrom) {
          return false;
        }

        if (options.blockTo && content.blockNumber > options.blockTo) {
          return false;
        }
      }

      if (options.msaIds && options.msaIds.length > 0 && !options.msaIds.includes(content.announcement.fromId)) {
        return false;
      }

      if (options?.contentHash && options.contentHash !== getContentHash(content)) {
        return false;
      }

      return true;
    }
  });
}
