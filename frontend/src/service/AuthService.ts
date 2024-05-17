import { ServerConfiguration } from '@typoas/runtime';
import * as dsnpLink from '../dsnpLink';

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

/**
 * Retrieves the context for the application.
 * If the access token is null, it creates a context without authentication.
 * Otherwise, it creates a context with token authentication.
 *
 * @returns The context object.
 */
export const getContext = () => {
  const contextOptions: any = {}

  if (process.env.REACT_APP_BACKEND_URL) {
    contextOptions.serverConfiguration = new ServerConfiguration(process.env.REACT_APP_BACKEND_URL, {});
  }

  if (accessToken) {
    contextOptions.authProviders = {
      tokenAuth: {
        getConfig: () => accessToken
      }
    }
  }

  // TODO: Handle expiring tokens

  // TODO: Something might be broken in typoas. This is trying to fix it
  return dsnpLink.createContext(contextOptions);
};
