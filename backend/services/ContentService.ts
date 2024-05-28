import { Handler } from 'openapi-backend';
import type * as T from '../types/openapi.js';
import { Post, getPostsInRange, getSpecificContent } from './feed.js';
import { getCurrentBlockNumber } from './frequency.js';
import { GraphService } from './GraphService.js';
import { HttpError } from '../types/HttpError.js';
import { HttpStatusCode } from 'axios';

export interface IFeedRange {
  newestBlockNumber?: number;
  oldestBlockNumber?: number;
}

export async function getOwnContent(msaId: string, { newestBlockNumber, oldestBlockNumber }: IFeedRange) {
  // Default to now
  const newest = newestBlockNumber ?? (await getCurrentBlockNumber());
  const oldest = Math.max(1, oldestBlockNumber || 1, newest - 45_000); // 45k blocks at a time max

  try {
    const posts = await getPostsInRange(newest, oldest);
    const response: T.Paths.GetUserFeed.Responses.$200 = {
      newestBlockNumber: newest,
      oldestBlockNumber: oldest,
      posts: posts.filter((x) => x.fromId === msaId),
    };
    return response;
  } catch (e) {
    throw new HttpError(HttpStatusCode.InternalServerError, 'Error fetching feed for current user', { cause: e });
  }
}

export async function getFollowingContent(msaId: string, { newestBlockNumber, oldestBlockNumber }: IFeedRange) {
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

export async function getDiscover(
  msaId: string,
  {
    newestBlockNumber,
    oldestBlockNumber,
  }: {
    newestBlockNumber?: number;
    oldestBlockNumber?: number;
  }
) {
  // Default to now
  const newest = newestBlockNumber ?? (await getCurrentBlockNumber());
  const oldest = Math.max(1, oldestBlockNumber || 1, newest - 45_000); // 45k blocks at a time max

  const posts = await getPostsInRange(newest, oldest);
  const response: T.Paths.GetFeed.Responses.$200 = {
    newestBlockNumber: newest,
    oldestBlockNumber: oldest,
    posts: posts.filter((x) => x.fromId !== msaId),
  };
  return response;
}

export async function getContent(msaId: string, contentHash: string): Promise<Post> {
  const content = await getSpecificContent(msaId, contentHash);
  if (!content) {
    throw new HttpError(HttpStatusCode.NoContent, 'Specified content not found');
  }
  return content;
}

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
