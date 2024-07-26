import type { Paths } from '../types/openapi.js';
import {
  type AnnouncementResponse,
  ReplyAnnouncement,
  ReactionAnnouncement,
  TombstoneAnnouncement,
  UpdateAnnouncement,
} from './content-announcement/types.gen.js';

export type AssetUploadRequest = Paths.PostAssetsHandler.RequestBody;

export type PostBroadcastRequest = Paths.PostBroadcastHandler.RequestBody;
export type PostBroadcastResponse = Paths.PostBroadcastHandler.Responses.$202;
export type RelatedAnnouncementResponse = AnnouncementResponse & {
  announcement: ReplyAnnouncement | ReactionAnnouncement | TombstoneAnnouncement | UpdateAnnouncement;
};
