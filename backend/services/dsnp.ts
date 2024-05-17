// TODO: Can this come from a DSNP package instead?

import {
  AnnouncementType,
  BroadcastAnnouncement,
  ProfileAnnouncement,
  ReactionAnnouncement,
  ReplyAnnouncement,
  TombstoneAnnouncement,
} from "../types/content-announcement";

/**
 * createTombstone() generates a tombstone announcement from a given URL and
 * hash.
 *
 * @param fromId         - The id of the user from whom the announcement is posted
 * @param targetType      - The DSNP announcement type of the target announcement
 * @param targetSignature - The signature of the target announcement
 * @returns A TombstoneAnnouncement
 */
export const createTombstone = (
  fromId: string,
  targetType: AnnouncementType,
  targetSignature: string
): TombstoneAnnouncement => ({
  announcementType: AnnouncementType.Tombstone,
  targetAnnouncementType: targetType,
  targetContentHash: targetSignature,
  fromId,
});

/**
 * createBroadcast() generates a broadcast announcement from a given URL and
 * hash.
 *
 * @param fromId   - The id of the user from whom the announcement is posted
 * @param url       - The URL of the activity content to reference
 * @param hash      - The hash of the content at the URL
 * @returns A BroadcastAnnouncement
 */
export const createBroadcast = (fromId: string, url: string, hash: string): BroadcastAnnouncement => ({
  announcementType: AnnouncementType.Broadcast,
  contentHash: hash,
  fromId,
  url,
});

/**
 * createReply() generates a reply announcement from a given URL, hash and
 * content uri.
 *
 * @param fromId   - The id of the user from whom the announcement is posted
 * @param url       - The URL of the activity content to reference
 * @param hash      - The hash of the content at the URL
 * @param inReplyTo - The DSNP Content Uri of the parent announcement
 * @returns A ReplyAnnouncement
 */
export const createReply = (fromId: string, url: string, hash: string, inReplyTo: string): ReplyAnnouncement => ({
  announcementType: AnnouncementType.Reply,
  contentHash: hash,
  fromId,
  inReplyTo,
  url,
});

/**
 * createReaction() generates a reaction announcement from a given URL, hash and
 * content uri.
 *
 * @param fromId   - The id of the user from whom the announcement is posted
 * @param emoji     - The emoji to respond with
 * @param inReplyTo - The DSNP Content Uri of the parent announcement
 * @returns A ReactionAnnouncement
 */
export const createReaction = (
  fromId: string,
  emoji: string,
  inReplyTo: string,
  apply: number,
): ReactionAnnouncement => ({
  announcementType: AnnouncementType.Reaction,
  emoji,
  fromId,
  inReplyTo,
  apply,
});

/**
 * createProfile() generates a profile announcement from a given URL and hash.
 *
 * @param fromId   - The id of the user from whom the announcement is posted
 * @param url       - The URL of the activity content to reference
 * @param hash      - The hash of the content at the URL
 * @returns A ProfileAnnouncement
 */
export const createProfile = (fromId: string, url: string, hash: string): ProfileAnnouncement => ({
  announcementType: AnnouncementType.Profile,
  contentHash: hash,
  fromId,
  url,
});
