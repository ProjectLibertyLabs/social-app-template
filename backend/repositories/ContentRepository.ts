/** Content Repository
 *
 * Dummy service for caching content; replace with a persistence/cache layer of your choice.
 * This one is horribly inefficient and does not scale!
 *
 * Notes about this bare-bones content repository:
 *
 * - Primary announcements are stored by their `contentHash`. A "real" implementation
 *   would likely have a database backend so that content announcements could be easily queried
 *   by various criteria (MSA, timestamp/block range, schema/announcement type, etc)
 *
 * - Secondary announcements (Replies, Reactions, Tombstones) are indexed by the content hash
 *   of the parent announcement
 */

import { createHash } from 'crypto';
import {
  type AnnouncementResponse,
  AnnouncementType,
  ReactionAnnouncement,
  ReplyAnnouncement,
  TombstoneAnnouncement,
  UpdateAnnouncement,
} from '../types/content-announcement';
import '../types/content-announcement/type.augment';
import {
  isBroadcast,
  isProfile,
  isReaction,
  isReply,
  isTombstone,
  isUpdate,
} from '../types/content-announcement/type.augment';
import logger from '../logger';
import Database from 'better-sqlite3';

export type ContentSearchParametersType = {
  msaIds?: string[];
  schemaIds?: string[];
  announcementTypes?: AnnouncementType[];
  blockFrom?: number;
  blockTo?: number;
  contentHash?: string;
  relatedContentHash?: string;
};

type RelatedAnnouncementResponse = AnnouncementResponse & {
  announcement: ReplyAnnouncement | ReactionAnnouncement | TombstoneAnnouncement | UpdateAnnouncement;
};

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

function getContentHashFromURI(dsnpUri: string): string | null {
  return /^dsnp:\/\/[\d]+\/([^\/]*)(?:\/)?/i.exec(dsnpUri)?.[1] ?? null;
}

function getKey(contentAnnouncement: AnnouncementResponse) {
  const hash = getContentHash(contentAnnouncement);
  const {
    blockNumber,
    announcement: { fromId },
  } = contentAnnouncement;

  return `${blockNumber}:${fromId}:${hash}`;
}

function getRelatedHash(contentAnnouncement: AnnouncementResponse): string | null {
  const { announcement } = contentAnnouncement;
  if (isBroadcast(announcement)) {
    return null;
  } else if (isReply(announcement) || isReaction(announcement)) {
    return getContentHashFromURI(announcement.inReplyTo);
  } else if (isTombstone(announcement) || isUpdate(announcement)) {
    return announcement.targetContentHash;
  }

  return null;
}

export class ContentRepository {
  private static db: any;
  // TODO: more tightly bind the announcement types. Reactions and replies only in contentResponseMap.
  private static contentMap = new Map<string, AnnouncementResponse>();
  private static contentResponseMap = new Map<string, RelatedAnnouncementResponse>();

  static init() {
    try {
      ContentRepository.db = new Database('./db/contentDb.sqlite', {
        fileMustExist: true,
        verbose: (msg) => logger.info(msg),
      });
    } catch (err) {
      logger.info('Creating content DB...');
      ContentRepository.db = new Database('./db/contentDb.sqlite', {
        fileMustExist: false,
        verbose: (msg) => logger.info(msg),
      });
      ContentRepository.db.exec(
        'CREATE TABLE IF NOT EXISTS "announcements"("id" INTEGER PRIMARY KEY ASC, "key" TEXT UNIQUE, "relatedKey" TEXT, "announcement" BLOB, "content" BLOB)'
      );
    }

    logger.info('Connected to content DB');
  }

  public static add(content: AnnouncementResponse) {
    switch (content.announcement.announcementType) {
      case AnnouncementType.Broadcast: {
        const key = getKey(content);
        logger.debug({ key, content }, 'Storing broadcast content');
        // ContentRepository.contentMap.set(key, content);
        const stmt = ContentRepository.db.prepare(
          'INSERT OR REPLACE INTO "announcements"("key", "announcement") VALUES (:key, json(:content))'
        );
        const result = stmt.run({ key, content: JSON.stringify(content) });
        logger.debug(result, 'Stored broadcast content in DB');
        break;
      }
      case AnnouncementType.Reply:
      case AnnouncementType.Reaction:
      case AnnouncementType.Tombstone:
      case AnnouncementType.Update: {
        const key = getKey(content as AnnouncementResponse);
        const relatedKey = getRelatedHash(content);
        logger.debug({ key, content, relatedKey }, 'Storing response content');
        // ContentRepository.contentResponseMap.set(key, content as RelatedAnnouncementResponse);
        const stmt = ContentRepository.db.prepare(
          'INSERT OR REPLACE INTO "announcements"("key", "relatedKey", "announcement") VALUES (:key, :relatedKey, json(:content))'
        );
        const result = stmt.run({ key, relatedKey, content: JSON.stringify(content) });
        logger.debug(result, 'Stored response content in DB');
        break;
      }

      default: {
        const key = getKey(content);
        logger.debug(
          { key, content, announcementType: content.announcement.announcementType.toString() },
          'Storing content for other announcement'
        );
        const stmt = ContentRepository.db.prepare(
          'INSERT OR REPLACE INTO "announcements"("key", "announcement") VALUES (:key, json(:content))'
        );
        const result = stmt.run({ key, content: JSON.stringify(content) });
        logger.debug(result, 'Stored other content in DB');
        break;
      }
    }
  }

  public static get(options?: ContentSearchParametersType): AnnouncementResponse[] {
    let sql = 'SELECT json("announcement") as "announcement_json" FROM "announcements" ';
    const conditionals: string[] = [];
    if (options) {
      if (options.schemaIds) {
        conditionals.push(`"announcement_json"->>'$.schemaId' IN (SELECT value from json_each(:schemaIds))`);
      }

      if (options.announcementTypes) {
        conditionals.push(
          `"announcement_json"->>'$.announcement.announcementType' IN (SELECT value from json_each(:announcementTypes))`
        );
      }

      if (options.blockFrom !== undefined) {
        conditionals.push(`"announcement_json"->>'$.blockNumber' >= :blockFrom`);
      }

      if (options.blockTo !== undefined) {
        conditionals.push(`"announcement_json"->>'$.blockNumber' <= :blockTo`);
      }

      if (options.msaIds && options.msaIds.length > 0) {
        conditionals.push(`"announcement_json"->>'$.announcement.fromId IN  (SELECT value from json_each(:msaIds))`);
      }

      if (options.contentHash) {
        conditionals.push(`"announcement_json"->>'$.announcement.contentHash' = :contentHash`);
      }

      if (options.relatedContentHash) {
        conditionals.push(`"relatedKey" = :relatedContentHash`);
      }
    }

    sql += `WHERE ${conditionals.join(' AND ')}`;
    logger.debug({ sql }, 'Executing query to retrieve announcements');
    const stmt = ContentRepository.db.prepare(sql);
    const rows: { announcement_json: string }[] = stmt.all({
      ...options,
      schemaIds: JSON.stringify(options?.schemaIds),
      announcementTypes: JSON.stringify(options?.announcementTypes),
      msaIds: JSON.stringify(options?.msaIds),
    });
    const response = rows.map(({ announcement_json }) => JSON.parse(announcement_json) as AnnouncementResponse);
    logger.debug({ numRows: response.length, response }, 'Retrieved content from DB');
    return response;
  }
}
