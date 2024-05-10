import { randomUUID } from 'crypto';
import { getApi } from './frequency.js';
import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from 'axios';

export type RequestAccount = { publicKey: string; msaId?: string };

// uuid auth token to Public Key
const authTokenRegistry: Map<string, RequestAccount> = new Map();

type CacheData = { msaId: string; added: Date };
const cachePublicKeys: Map<string, CacheData> = new Map();

export function createAuthToken(publicKey: string): string {
  const uuid = randomUUID();
  authTokenRegistry.set(uuid, { publicKey });
  return uuid;
}

export function revokeAuthToken(token: string): void {
  authTokenRegistry.delete(token);
}

export async function getAccountFromAuth(token: string): Promise<null | RequestAccount> {
  const account = authTokenRegistry.get(token);
  if (!account) return null;
  if (account.msaId) return account;

  // Cache that msaId if we can...
  account.msaId = (await getMsaByPublicKey(account.publicKey)) || undefined;
  authTokenRegistry.set(token, account);
  return account;
}

export async function getMsaByPublicKey(publicKey: string): Promise<string | null> {
  const cachedResult = cachePublicKeys.get(publicKey);
  if (cachedResult && cachedResult.added.getTime() + 360 < new Date().getTime()) {
    return cachedResult.msaId;
  }
  const api = await getApi();
  const msaId = await api.query.msa.publicKeyToMsaId(publicKey);
  if (msaId.isNone) return null;
  const msaIdStr = msaId.value.toString();
  cachePublicKeys.set(publicKey, { added: new Date(), msaId: msaIdStr });
  return msaIdStr;
}

export function getAuthToken(req: Request): string | null {
  if (req.headers?.authorization && typeof req.headers.authorization === 'string') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

export async function validateAuthToken(req: Request, res: Response, next: NextFunction) {
  const token = getAuthToken(req);
  if (!token) {
    return res.status(HttpStatusCode.Unauthorized).end();
  }

  const account = await getAccountFromAuth(token);

  if (account === null) {
    return res.status(HttpStatusCode.Unauthorized).end();
  }

  // you can also add any auth information to the return value
  Object.assign(req.headers, account);
  next();
}

/// Dev function useful to swap in to endpoints when testing with Postman, etc
export function debugAuthToken(req: Request, res: Response, next: NextFunction) {
  Object.assign(req.headers, {
    publicKey: process.env.DEBUG_PUBKEY,
    msaId: process.env.DEBUG_MSA_ID,
  });
  next();
}

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
