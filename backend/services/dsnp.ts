// TODO: Can this come from a DSNP package instead?

/**
 * AnnouncementType: an enum representing different types of DSNP announcements
 */
export enum AnnouncementType {
  Tombstone = 0,
  Broadcast = 2,
  Reply = 3,
  Reaction = 4,
  Profile = 5,
  Update = 6,
  PublicFollows = 113,
}

/**
 * Announcement: an Announcement intended for inclusion in a batch file
 */
export type Announcement = TypedAnnouncement<AnnouncementType>;

/**
 * TypedAnnouncement: an Announcement with a particular AnnouncementType
 */
export type TypedAnnouncement<T extends AnnouncementType> = {
  announcementType: T;
  fromId: string;
} & (
  | TombstoneFields
  | BroadcastFields
  | ReplyFields
  | ReactionFields
  | ProfileFields
);

type TombstoneFields = {
  announcementType: AnnouncementType.Tombstone;
  targetAnnouncementType: AnnouncementType;
  targetSignature: string;
};

type BroadcastFields = {
  announcementType: AnnouncementType.Broadcast;
  contentHash: string;
  url: string;
};

type ReplyFields = {
  announcementType: AnnouncementType.Reply;
  contentHash: string;
  inReplyTo: string;
  url: string;
};

type ReactionFields = {
  announcementType: AnnouncementType.Reaction;
  emoji: string;
  inReplyTo: string;
};

type ProfileFields = {
  announcementType: AnnouncementType.Profile;
  contentHash: string;
  url: string;
};

/**
 * TombstoneAnnouncement: an Announcement of type Tombstone
 */
export type TombstoneAnnouncement =
  TypedAnnouncement<AnnouncementType.Tombstone>;

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
  targetSignature: string,
): TombstoneAnnouncement => ({
  announcementType: AnnouncementType.Tombstone,
  targetAnnouncementType: targetType,
  targetSignature,
  fromId,
});

/**
 * BroadcastAnnouncement: an Announcement of type Broadcast
 */
export type BroadcastAnnouncement =
  TypedAnnouncement<AnnouncementType.Broadcast>;

/**
 * createBroadcast() generates a broadcast announcement from a given URL and
 * hash.
 *
 * @param fromId   - The id of the user from whom the announcement is posted
 * @param url       - The URL of the activity content to reference
 * @param hash      - The hash of the content at the URL
 * @returns A BroadcastAnnouncement
 */
export const createBroadcast = (
  fromId: string,
  url: string,
  hash: string,
): BroadcastAnnouncement => ({
  announcementType: AnnouncementType.Broadcast,
  contentHash: hash,
  fromId,
  url,
});

/**
 * ReplyAnnouncement: am announcement of type Reply
 */
export type ReplyAnnouncement = TypedAnnouncement<AnnouncementType.Reply>;

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
export const createReply = (
  fromId: string,
  url: string,
  hash: string,
  inReplyTo: string,
): ReplyAnnouncement => ({
  announcementType: AnnouncementType.Reply,
  contentHash: hash,
  fromId,
  inReplyTo,
  url,
});

/**
 * ReactionAnnouncement: an Announcement of type Reaction
 */
export type ReactionAnnouncement = TypedAnnouncement<AnnouncementType.Reaction>;

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
): ReactionAnnouncement => ({
  announcementType: AnnouncementType.Reaction,
  emoji,
  fromId,
  inReplyTo,
});

/**
 * ProfileAnnouncement: an Announcement of type Profile
 */
export type ProfileAnnouncement = TypedAnnouncement<AnnouncementType.Profile>;

/**
 * createProfile() generates a profile announcement from a given URL and hash.
 *
 * @param fromId   - The id of the user from whom the announcement is posted
 * @param url       - The URL of the activity content to reference
 * @param hash      - The hash of the content at the URL
 * @returns A ProfileAnnouncement
 */
export const createProfile = (
  fromId: string,
  url: string,
  hash: string,
): ProfileAnnouncement => ({
  announcementType: AnnouncementType.Profile,
  contentHash: hash,
  fromId,
  url,
});
