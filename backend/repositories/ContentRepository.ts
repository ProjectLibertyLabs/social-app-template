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
} from '../types/content-announcement';
import '../types/content-announcement/type.augment';
import { isBroadcast, isProfile, isReply, isTombstone, isUpdate } from '../types/content-announcement/type.augment';
import logger from '../logger';
import Database from 'better-sqlite3';

export type ContentSearchParametersType = {
  msaIds?: string[];
  schemaIds?: string[];
  announcementTypes?: AnnouncementType[];
  blockFrom?: number;
  blockTo?: number;
  contentHash?: string;
};

type ResponseAnnouncementResponse = AnnouncementResponse & { announcement: ReplyAnnouncement | ReactionAnnouncement };

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

function getResponseKey(contentAnnouncement: ResponseAnnouncementResponse): string {
  const responseInReplyTo = contentAnnouncement.announcement.inReplyTo;
  const parentContentHash = responseInReplyTo.split('/').pop();
  if (!parentContentHash) throw new Error('Invalid URI');
  return parentContentHash;
}

export class ContentRepository {
  private static db: any;
  // TODO: more tightly bind the announcement types. Reactions and replies only in contentResponseMap.
  private static contentMap = new Map<string, AnnouncementResponse>();
  private static contentResponseMap = new Map<string, ResponseAnnouncementResponse>();

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
        'CREATE TABLE IF NOT EXISTS "announcements"("id" INTEGER PRIMARY KEY ASC, "key" TEXT UNIQUE, "announcement" BLOB, "content" BLOB)'
      );
    }

    logger.info('Connected to content DB');
  }

  public static add(content: AnnouncementResponse) {
    switch (content.announcement.announcementType) {
      case AnnouncementType.Broadcast: {
        const key = getKey(content);
        logger.debug({ key, content }, 'Storing broadcast content');
        ContentRepository.contentMap.set(key, content);
        const stmt = ContentRepository.db.prepare('INSERT INTO "announcements"("announcement") VALUES (json(?))');
        const result = stmt.run([JSON.stringify(content)]);
        logger.debug(result, 'Stored broadcast content in DB');
        break;
      }
      case AnnouncementType.Reply:
      case AnnouncementType.Reaction: {
        const key = getResponseKey(content as ResponseAnnouncementResponse);
        logger.debug({ key, content }, 'Storing response content');
        ContentRepository.contentResponseMap.set(key, content as ResponseAnnouncementResponse);
        const stmt = ContentRepository.db.prepare('INSERT INTO "announcements"("announcement") VALUES (json(?))');
        const result = stmt.run([JSON.stringify(content)]);
        logger.debug(result, 'Stored response content in DB');
        break;
      }
      default: {
        const key = getKey(content);
        logger.debug(
          { key, content, announcementType: content.announcement.announcementType.toString() },
          'Storing content for other announcement'
        );
        ContentRepository.contentMap.set(key, content);
        const stmt = ContentRepository.db.prepare('INSERT INTO "announcements"("announcement") VALUES (json(?))');
        const result = stmt.run([JSON.stringify(content)]);
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
