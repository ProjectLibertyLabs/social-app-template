import { randomUUID } from 'crypto';
import { getApi } from './frequency.js';
import { HttpStatusCode } from 'axios';
import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

export interface RequestAccount {
  publicKey: string;
  msaId?: string;
}

export class TokenManager {
  private authTokenRegistry: Map<string, RequestAccount> = new Map();
  private cachePublicKeys: Map<string, { msaId: string; added: Date }> = new Map();

  /**
   * Creates an authentication token for the given public key.
   * @param publicKey - The public key associated with the token.
   * @returns The generated authentication token.
   */
  createAuthToken(publicKey: string): string {
    const uuid = randomUUID();
    this.authTokenRegistry.set(uuid, { publicKey });
    return uuid;
  }

  /**
   * Revokes an authentication token.
   * @param token - The authentication token to revoke.
   */
  revokeAuthToken(token: string): void {
    this.authTokenRegistry.delete(token);
  }

  /**
   * Retrieves the account associated with the provided authentication token.
   * @param token - The authentication token.
   * @returns A Promise that resolves to the account associated with the token, or null if no account is found.
   */
  async getAccountFromAuth(token: string): Promise<null | RequestAccount> {
    const account = this.authTokenRegistry.get(token);
    if (!account) return null;
    if (account.msaId) return account;

    // Cache that msaId if we can...
    account.msaId = (await this.getMsaByPublicKey(account.publicKey)) || undefined;
    this.authTokenRegistry.set(token, account);
    return account;
  }

  /**
   * Retrieves the MSA ID associated with the given public key.
   * @param publicKey - The public key for which to retrieve the MSA ID.
   * @returns A Promise that resolves to the MSA ID as a string, or null if the MSA ID is not found.
   */
  async getMsaByPublicKey(publicKey: string): Promise<string | null> {
    const cachedResult = this.cachePublicKeys.get(publicKey);
    if (cachedResult && cachedResult.added.getTime() + 360 < new Date().getTime()) {
      return cachedResult.msaId;
    }

    // TODO: Implement this
    // Use Account Service to get the MSA ID
    // try {
    //   const response = await AccountService.getInstance().then((service) =>
    //     service.getAccount(publicKey),
    //   );
    // } catch (e) {
    //   console.error("Failed to get MSA ID: ", e);
    //   return null;
    // }

    const api = await getApi();
    const msaId = await api.query.msa.publicKeyToMsaId(publicKey);
    if (msaId.isNone) return null;
    const msaIdStr = msaId.value.toString();
    this.cachePublicKeys.set(publicKey, { added: new Date(), msaId: msaIdStr });
    return msaIdStr;
  }

  /**
   * Retrieves the authentication token from the request headers.
   * @param req - The request object with authentication token in the headers.
   * @returns The authentication token or null if not found.
   */
  getAuthToken(req: Request): string | null {
    if (req.headers?.authorization && typeof req.headers.authorization === 'string') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }
}

// Singleton instance of the TokenManager
const tokenManager = new TokenManager();

/**
 * Validates the authentication token in the request headers.
 * If the token is valid, it adds the account information to the request headers and calls the next middleware.
 * If the token is invalid or missing, it sends an unauthorized response.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 */
export async function validateAuthToken(req: Request, res: Response, next: NextFunction) {
  const token = tokenManager.getAuthToken(req);
  logger.debug(`TokenAuth: validateAuthToken: token:(${token})`);
  if (!token) {
    return res.status(HttpStatusCode.Unauthorized).end();
  }

  const account = await tokenManager.getAccountFromAuth(token);
  logger.debug(`TokenAuth: validateAuthToken: account:(${JSON.stringify(account, null, 2)})`);

  if (account === null) {
    return res.status(HttpStatusCode.Unauthorized).end();
  }

  // You can also add any auth information to the return value
  Object.assign(req.headers, account);
  next();
}

/**
 * Dev function useful to swap in to endpoints when testing with Postman, etc
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function to call in the middleware chain.
 */
export function debugAuthToken(req: Request, res: Response, next: NextFunction) {
  Object.assign(req.headers, {
    publicKey: process.env.DEBUG_PUBKEY,
    msaId: process.env.DEBUG_MSA_ID,
  });
  next();
}

/**
 * Validates the MSA ID in the request headers.
 * @param req - The request object with the MSA ID in the headers.
 * @param res - The response object.
 * @param next - The next function to call in the middleware chain.
 * @returns If the MSA is missing or invalid, it sends an error response. Otherwise, it calls the next function.
 */
export async function validateMsaAuth(req: Request, res: Response, next: NextFunction) {
  const { msaId } = req.headers;

  // Make sure msaId is populated & is a string (as opposed to an array)
  if (!msaId || typeof msaId !== 'string') {
    return res.status(HttpStatusCode.Unauthorized).send('Missing or invalid MSA').end();
  }

  try {
    BigInt(msaId);
    next();
  } catch (err: any) {
    return res.status(HttpStatusCode.Unauthorized).send('Invalid MSA');
  }
}

export function debugMsaAuth(_req: Request, _res: Response, next: NextFunction) {
  next();
}
