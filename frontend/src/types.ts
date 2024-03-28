import type { ProviderResponse } from "./dsnpLink";

export type Network = ProviderResponse["network"];

export type UserAccount = {
  expires: number;
  accessToken: string;
} & User;

export type User = {
  handle: string;
  dsnpId: string;
  profile?: {
    icon: string;
    name: string;
  };
};

export enum FeedTypes {
  MY_FEED,
  DISCOVER,
  DISPLAY_ID_POSTS,
  MY_POSTS,
}

export type HexString = string;

export enum RelationshipStatus {
  FOLLOWING,
  NONE,
}
