/** Content Repository
 *
 * Dummy service for caching content; replace with a persistence/cache layer of your choice.
 * This one is horribly inefficient and does not scale!
 */

import { createHash } from 'crypto';
import { AnnouncementType, type AnnouncementResponse } from '../types/content-announcement';
import '../types/content-announcement/type.augment';
import { isBroadcast, isProfile, isReply, isTombstone, isUpdate } from '../types/content-announcement/type.augment';
import logger from '../logger';
import redis from '../services/RedisService';

export type ContentSearchParametersType = {
  msaIds?: string[];
  schemaIds?: string[];
  announcementTypes?: AnnouncementType[];
  blockFrom?: number;
  blockTo?: number;
  contentHash?: string;
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

function getKey(contentAnnouncement: AnnouncementResponse) {
  const hash = getContentHash(contentAnnouncement);
  const {
    blockNumber,
    announcement: { fromId },
  } = contentAnnouncement;

  return `${blockNumber}:${fromId}:${hash}`;
}

export async function add(content: AnnouncementResponse) {
  const prefix = 'backend:content:';
  const key = prefix + getKey(content);
  logger.debug({ key, content }, 'Storing content');
  await redis.set(key, JSON.stringify(content));
}
export async function get(options?: ContentSearchParametersType): Promise<AnnouncementResponse[]> {
  try {
    // Use scan instead of keys for production environments to avoid performance hit
    const stream = redis.scanStream({
      match: '*', // Adjust pattern as needed
      count: 100, // Adjust based on your average key size and count
    });

    const keys: string[] = [];
    await new Promise((resolve, reject) => {
      stream.on('data', (resultKeys: string[]) => {
        // Collect keys from each scan and filter out bull keys
        const filteredKeys = resultKeys.filter((key) => key.startsWith('backend:content:'));
        keys.push(...filteredKeys);
      });
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    // If no keys have been added, return an empty array
    if (keys.length === 0) return [];
    logger.debug({ keys }, 'Fetched keys');

    const contents = await Promise.all(keys.map(async (key) => {
      try {
        const contentString = await redis.get(key);
        if (contentString) {
          return JSON.parse(contentString) as AnnouncementResponse;
        }
      } catch (error) {
        console.error(`Error parsing content for key ${key}:`, error);
        // Decide on how to handle individual content parse errors
      }
    }));
    logger.debug({ keys, contents }, 'Fetched keys and contents');

    // Filter out undefined values due to parse errors or null redis.get responses
    const validContents = contents.filter((content): content is AnnouncementResponse => content !== undefined);
    logger.debug({ validContents }, 'Fetched contents');

    return validContents.filter((content) => {
      if (!options) return true;

      const { schemaIds, announcementTypes, blockFrom, blockTo, msaIds, contentHash } = options;

      if (schemaIds && !schemaIds.includes(content.schemaId)) return false;
      if (announcementTypes && !announcementTypes.includes(content.announcement.announcementType)) return false;
      if (blockFrom !== undefined && content.blockNumber < blockFrom) return false;
      if (blockTo !== undefined && content.blockNumber > blockTo) return false;
      if (msaIds && msaIds.length > 0 && !msaIds.includes(content.announcement.fromId)) return false;
      if (contentHash && contentHash !== getContentHash(content)) return false;

      return true;
    });
  } catch (error) {
    console.error('Error fetching contents:', error);
    throw error; // Or handle it as per your application's error handling policy
  }
}

// export async function get(options?: ContentSearchParametersType): Promise<AnnouncementResponse[]> {
//   const keys = await redis.keys('*');
//   const contents = await Promise.all(keys.map(async key => {
//     const contentString = await redis.get(key);
//     return JSON.parse(contentString as string) as AnnouncementResponse;
//   }));

//   return contents.filter((content) => {
//     if (options) {
//       if (options.schemaIds && !options.schemaIds.includes(content.schemaId)) {
//         return false;
//       }

//       if (options.announcementTypes && !options.announcementTypes.includes(content.announcement.announcementType)) {
//         return false;
//       }

//       if (options.blockFrom !== undefined) {
//         if (content.blockNumber < options.blockFrom) {
//           return false;
//         }

//         if (options.blockTo && content.blockNumber > options.blockTo) {
//           return false;
//         }
//       }

//       if (options.msaIds && options.msaIds.length > 0 && !options.msaIds.includes(content.announcement.fromId)) {
//         return false;
//       }

//       if (options?.contentHash && options.contentHash !== getContentHash(content)) {
//         return false;
//       }

//       return true;
//     }
//   });
// }
