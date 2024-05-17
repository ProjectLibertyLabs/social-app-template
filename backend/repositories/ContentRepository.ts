/** Content Repository
 *
 * Dummy service for caching content; replace with a persistence/cache layer of your choice.
 * This one is horribly inefficient and does not scale!
 */

import { createHash } from "crypto";
import {
  AnnouncementType,
  type AnnouncementResponse,
} from "../types/content-announcement";
import "../types/content-announcement/type.augment";
import {
  isBroadcast,
  isProfile,
  isReply,
  isTombstone,
  isUpdate,
} from "../types/content-announcement/type.augment";
import logger from "../logger";

export type ContentSearchParametersType = {
  msaIds?: string[];
  schemaIds?: string[];
  announcementTypes?: AnnouncementType[];
  blockFrom?: number;
  blockTo?: number;
};

const contentMap = new Map<string, AnnouncementResponse>();

function getContentHash(contentAnnouncement: AnnouncementResponse) {
  const { announcement } = contentAnnouncement;
  if (
    isBroadcast(announcement) ||
    isProfile(announcement) ||
    isReply(announcement) ||
    isUpdate(announcement)
  ) {
    return announcement.contentHash;
  } else if (isTombstone(announcement)) {
    return announcement.targetContentHash;
  } else {
    return createHash("sha256")
      .update(JSON.stringify(announcement))
      .digest("base64url");
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

export function add(content: AnnouncementResponse) {
  const key = getKey(content);
  logger.debug({ key, content }, "Storing content");
  contentMap.set(key, content);
}

export function get(
  options?: ContentSearchParametersType,
): AnnouncementResponse[] {
  return [...contentMap.values()].filter((content) => {
    if (options) {
      if (options.schemaIds && !options.schemaIds.includes(content.schemaId)) {
        return false;
      }

      if (
        options.announcementTypes &&
        !options.announcementTypes.includes(
          content.announcement.announcementType,
        )
      ) {
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

      return true;
    }
  });
}
