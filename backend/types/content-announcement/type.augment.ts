import "./types.gen";
import {
  AnnouncementType,
  BroadcastAnnouncement,
  ProfileAnnouncement,
  ReactionAnnouncement,
  ReplyAnnouncement,
  TombstoneAnnouncement,
  TypedAnnouncement,
  UpdateAnnouncement,
} from "./types.gen";

export function isBroadcast(
  announcement: TypedAnnouncement,
): announcement is BroadcastAnnouncement {
  return announcement.announcementType === AnnouncementType.Broadcast;
}

export function isProfile(
  announcement: TypedAnnouncement,
): announcement is ProfileAnnouncement {
  return announcement.announcementType === AnnouncementType.Profile;
}

export function isReaction(
  announcement: TypedAnnouncement,
): announcement is ReactionAnnouncement {
  return announcement.announcementType === AnnouncementType.Reaction;
}

export function isReply(
  announcement: TypedAnnouncement,
): announcement is ReplyAnnouncement {
  return announcement.announcementType === AnnouncementType.Reply;
}

export function isTombstone(
  announcement: TypedAnnouncement,
): announcement is TombstoneAnnouncement {
  return announcement.announcementType === AnnouncementType.Tombstone;
}

export function isUpdate(
  announcement: TypedAnnouncement,
): announcement is UpdateAnnouncement {
  return announcement.announcementType === AnnouncementType.Update;
}
