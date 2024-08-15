/** Content Repository
 *
 * Very bare-bones SQLite DB persistence mechanism for caching content announced from the chain.
 * Replace with a persistence mechanism of your choosing.
 *
 */

import { createHash } from 'crypto';
import { type AnnouncementResponse, AnnouncementType } from '../types/content-announcement';
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

export type ContentOrderingParametersType = {
  field: 'blockNumber' | 'published';
  order: 'ASC' | 'DESC';
};

export type AnnouncementEntity = {
  key: string;
  announcement: AnnouncementResponse;
  content: unknown;
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
  return /^dsnp:\/\/[\d]+\/([^/]*)(?:\/)?/i.exec(dsnpUri)?.[1] ?? null;
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

function getFilter(options?: ContentSearchParametersType, sort?: ContentOrderingParametersType[]): string {
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

  const ordering = (sort || [{ field: 'blockNumber', order: 'DESC' }])?.map((sortField) => {
    switch (sortField.field) {
      case 'published':
        return `"content_json"->>'$.published' ${sortField.order || 'DESC'}`;

      case 'blockNumber':
        return `"announcement_json"->>'$.blockNumber' ${sortField.order || 'DESC'}`;

      default:
        return `"announcement_json"->>'$.blockNumber' DESC`;
    }
  });

  const orderBy = ordering?.length ? `ORDER BY ${ordering.join(', ')}` : '';
  const where = conditionals.length ? `WHERE ${conditionals.join(' AND ')}` : '';

  return `${where} ${orderBy}`;
}

export class ContentRepository {
  private static db: any;

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

  public static addAnnouncement(announcementResponse: AnnouncementResponse) {
    switch (announcementResponse.announcement.announcementType) {
      case AnnouncementType.Broadcast: {
        const key = getKey(announcementResponse);
        logger.debug({ key, content: announcementResponse }, 'Storing broadcast announcement');
        const stmt = ContentRepository.db.prepare(
          'INSERT OR REPLACE INTO "announcements"("key", "announcement") VALUES (:key, json(:announcement))'
        );
        const result = stmt.run({ key, announcement: JSON.stringify(announcementResponse) });
        logger.debug(result, 'Stored broadcast announcement in DB');
        break;
      }
      case AnnouncementType.Reply:
      case AnnouncementType.Reaction:
      case AnnouncementType.Tombstone:
      case AnnouncementType.Update: {
        const key = getKey(announcementResponse as AnnouncementResponse);
        const relatedKey = getRelatedHash(announcementResponse);
        logger.debug({ key, content: announcementResponse, relatedKey }, 'Storing response announcement');
        const stmt = ContentRepository.db.prepare(
          'INSERT OR REPLACE INTO "announcements"("key", "relatedKey", "announcement") VALUES (:key, :relatedKey, json(:announcement))'
        );
        const result = stmt.run({ key, relatedKey, announcement: JSON.stringify(announcementResponse) });
        logger.debug(result, 'Stored response announcement in DB');
        break;
      }

      default: {
        const key = getKey(announcementResponse);
        logger.debug(
          {
            key,
            announcement: announcementResponse,
            announcementType: announcementResponse.announcement.announcementType.toString(),
          },
          'Storing content for other announcement'
        );
        const stmt = ContentRepository.db.prepare(
          'INSERT OR REPLACE INTO "announcements"("key", "announcement") VALUES (:key, json(:announcement))'
        );
        const result = stmt.run({ key, announcement: JSON.stringify(announcementResponse) });
        logger.debug(result, 'Stored other announcement in DB');
        break;
      }
    }
  }

  public static addContent(key: string, content: unknown) {
    const stmt = ContentRepository.db.prepare(
      'UPDATE "announcements" SET "content" = json(:content) WHERE "key" = :key'
    );
    const result = stmt.run({ key, content: JSON.stringify(content) });
    logger.debug(result, 'Stored Parquet content in DB');
  }

  public static getAnnouncements(options?: ContentSearchParametersType): AnnouncementResponse[] {
    let sql = 'SELECT json("announcement") as "announcement_json" FROM "announcements" ';
    sql += getFilter(options);
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

  public static getAnnouncementsWithContent(options?: ContentSearchParametersType): AnnouncementEntity[] {
    let sql =
      'SELECT "key", json("announcement") as "announcement_json", json("content") as "content_json" FROM "announcements" ';
    sql += getFilter(options);
    logger.debug({ sql }, 'Executing query to retrieve announcements');
    const stmt = ContentRepository.db.prepare(sql);
    const rows: { key: string; announcement_json: string; content_json: string | null }[] = stmt.all({
      ...options,
      schemaIds: JSON.stringify(options?.schemaIds),
      announcementTypes: JSON.stringify(options?.announcementTypes),
      msaIds: JSON.stringify(options?.msaIds),
    });
    const response = rows.map(({ key, announcement_json, content_json }) => ({
      key,
      announcement: JSON.parse(announcement_json) as AnnouncementResponse,
      content: content_json ? JSON.parse(content_json) : null,
    }));
    logger.debug({ numRows: response.length, response }, 'Retrieved content from DB');
    return response;
  }
}
