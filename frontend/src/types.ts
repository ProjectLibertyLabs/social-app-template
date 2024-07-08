import type { ProviderResponse } from './dsnpLink';

export type Network = ProviderResponse['network'];

export type Handle = {
  base_handle: string;
  canonical_base: string;
  suffix: number;
};

export type UserAccount = {
  expires: number;
  accessToken: string;
} & User;

export type User = {
  handle?: Handle;
  msaId: string;
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
