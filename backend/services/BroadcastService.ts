import { ContentPublisherService } from './ContentPublisherService.js';
import { PostBroadcastRequest, PostBroadcastResponse } from '../types/types.js';
import { BroadcastDataBuilder } from './BroadcastDataBuilder.js';
import logger from '../logger.js';

export class BroadcastService {
  public static async create(msaId: string, params: PostBroadcastRequest): Promise<PostBroadcastResponse> {
    try {
      const repository = await ContentPublisherService.getInstance();
      const { assets, content, inReplyTo } = params;

      const data = BroadcastDataBuilder.build(content, assets);

      if (!inReplyTo) {
        await repository.postBroadcast(msaId, data);
      } else {
        const reply = { ...data, inReplyTo };

        await repository.postReply(msaId, reply);
      }

      return {
        content: data.content.content,
        published: data.content.published,
      };
    } catch (err) {
      logger.error({ err }, 'Failed to create broadcast');
      throw err;
    }
  }
}
