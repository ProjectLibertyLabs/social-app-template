import { Handler } from 'openapi-backend';
import Busboy from 'busboy';
import type * as T from '../types/openapi.js';
import { ipfsPin } from './ipfs.js';
import * as dsnp from './dsnp.js';
import { createImageAttachment, createImageLink, createNote } from '@dsnp/activity-content/factories';
import { publish } from './announce.js';
import { getPostsInRange } from './feed.js';
import { getCurrentBlockNumber } from './frequency.js';
import { GraphService } from './GraphService.js';
import * as Config from '../config/config.js';
import { HttpError } from '../types/HttpError.js';
import { HttpStatusCode } from 'axios';
import { Request } from 'express';

type Fields = Record<string, string>;
type File = {
  name: string;
  file: Buffer;
  info: Busboy.FileInfo;
};

export interface IFeedRange {
  newestBlockNumber?: number;
  oldestBlockNumber?: number;
}

export async function getUserFeed(msaId: string, { newestBlockNumber, oldestBlockNumber }: IFeedRange) {
  // Default to now
  const newest = newestBlockNumber ?? (await getCurrentBlockNumber());
  const oldest = Math.max(1, oldestBlockNumber || 1, newest - 45_000); // 45k blocks at a time max

  const posts = await getPostsInRange(newest, oldest);
  const response: T.Paths.GetUserFeed.Responses.$200 = {
    newestBlockNumber: newest,
    oldestBlockNumber: oldest,
    posts: posts.filter((x) => x.fromId === msaId),
  };
  return response;
}

export async function getFeed(msaId: string, { newestBlockNumber, oldestBlockNumber }: IFeedRange) {
  // Default to now
  const newest = newestBlockNumber ?? (await getCurrentBlockNumber());
  const oldest = Math.max(1, oldestBlockNumber || 1, newest - 45_000); // 45k blocks at a time max

  try {
    const following = await GraphService.instance().then((service) => service.getPublicFollows(msaId));

    const posts = await getPostsInRange(newest, oldest);
    const response: T.Paths.GetFeed.Responses.$200 = {
      newestBlockNumber: newest,
      oldestBlockNumber: oldest,
      posts: posts.filter((x) => following.includes(x.fromId)),
    };
    return response;
  } catch (e) {
    throw new HttpError(HttpStatusCode.InternalServerError, 'Error fetching feed for current user', { cause: e });
  }
}

export async function getDiscover({
  newestBlockNumber,
  oldestBlockNumber,
}: {
  newestBlockNumber?: number;
  oldestBlockNumber?: number;
}) {
  // Default to now
  const newest = newestBlockNumber ?? (await getCurrentBlockNumber());
  const oldest = Math.max(1, oldestBlockNumber || 1, newest - 45_000); // 45k blocks at a time max

  const posts = await getPostsInRange(newest, oldest);
  const response: T.Paths.GetFeed.Responses.$200 = {
    newestBlockNumber: newest,
    oldestBlockNumber: oldest,
    posts: posts,
  };
  return response;
}

export async function createBroadcast(msaId: string, req: Request) {
  try {
    const bb = Busboy({ headers: req.headers });

    const formAsync: Promise<[Fields, File[]]> = new Promise((resolve, reject) => {
      const files: File[] = [];
      const fields: Fields = {};
      bb.on('file', (name, file, info) => {
        // Take the file to a in memory buffer. This might be a bad idea.
        const chunks: Buffer[] = [];
        file
          .on('data', (chunk) => {
            chunks.push(chunk);
          })
          .on('close', () => {
            files.push({
              name,
              file: Buffer.concat(chunks),
              info,
            });
          });
      })
        .on('field', (name, val, _info) => {
          fields[name] = val;
        })
        .on('error', (e) => {
          reject(e);
        })
        .on('close', () => {
          resolve([fields, files]);
        });
    });
    req.pipe(bb);
    const [fields, files] = await formAsync;

    const attachment = await Promise.all(
      files
        .filter((x) => x.name === 'images')
        .map(async (image) => {
          const { cid, hash } = await ipfsPin(image.info.mimeType, image.file);
          return createImageAttachment([
            createImageLink(Config.instance().getIpfsContentUrl(cid), image.info.mimeType, [hash]),
          ]);
        })
    );

    const note = createNote(fields.content, new Date(), { attachment });
    const noteString = JSON.stringify(note);
    const { cid, hash: contentHash } = await ipfsPin('application/json', Buffer.from(noteString, 'utf8'));

    const announcement = fields.inReplyTo
      ? dsnp.createReply(msaId!, Config.instance().getIpfsContentUrl(cid), contentHash, fields.inReplyTo)
      : dsnp.createBroadcast(msaId!, Config.instance().getIpfsContentUrl(cid), contentHash);

    // Add it to the batch and publish
    await publish([announcement]);

    const response: T.Paths.CreateBroadcast.Responses.$200 = {
      ...announcement,
      fromId: announcement.fromId.toString(),
      content: noteString,
      timestamp: note.published,
      replies: [],
    };
    return response;
  } catch (e) {
    throw new HttpError(HttpStatusCode.InternalServerError, 'Error creating content broadcast', { cause: e });
  }
}

export const getContent: Handler<object> = async (c, _req, res) => {
  // T.Paths.GetContent.PathParameters
  if (c.request.params.dsnpId === '123') {
    const response: T.Paths.GetContent.Responses.$200 = {
      fromId: '123',
      contentHash: '0xabcd',
      content: '',
      timestamp: new Date().toISOString(),
      replies: [],
    };
    return res.status(200).json(response);
  }
  return res.status(404);
};

export const editContent: Handler<T.Paths.EditContent.RequestBody> = async (
  // , T.Paths.EditContent.PathParameters
  c,
  _req,
  res
) => {
  const response: T.Paths.EditContent.Responses.$200 = {
    fromId: '123',
    contentHash: '0xabcd',
    content: '',
    timestamp: new Date().toISOString(),
    replies: [],
  };
  return res.status(200).json(response);
};
