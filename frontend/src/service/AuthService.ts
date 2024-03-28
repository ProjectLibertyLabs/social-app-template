import * as dsnpLink from "../dsnpLink";

let accessToken: string | null = null;
let accessExpires: number | null = null;

export const setAccessToken = (token: string, expires: number): void => {
  accessToken = token;
  accessExpires = expires;
};

export const clearAccessToken = (token: string): void => {
  accessToken = null;
  accessExpires = null;
};

export const getContext = () => {
  if (accessToken === null) return dsnpLink.createContext();

  // TODO: Handle expiring tokens

  // TODO: Something might be broken in typoas. This is trying to fix it
  return dsnpLink.createContext({
    authProviders: {
      tokenAuth: {
        getConfig: () => accessToken,
      } as any,
    },
  });
};
