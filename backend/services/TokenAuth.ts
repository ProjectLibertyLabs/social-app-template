import { randomUUID } from "crypto";
import { getApi } from "./frequency.js";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "axios";

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

export async function getAccountFromAuth(
  token: string,
): Promise<null | RequestAccount> {
  const account = authTokenRegistry.get(token);
  if (!account) return null;
  if (account.msaId) return account;

  // Cache that msaId if we can...
  account.msaId = (await getMsaByPublicKey(account.publicKey)) || undefined;
  authTokenRegistry.set(token, account);
  return account;
}

export async function getMsaByPublicKey(
  publicKey: string,
): Promise<string | null> {
  const cachedResult = cachePublicKeys.get(publicKey);
  if (
    cachedResult &&
    cachedResult.added.getTime() + 360 < new Date().getTime()
  ) {
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
  if (
    req.headers?.authorization &&
    typeof req.headers.authorization === "string"
  ) {
    return req.headers.authorization.split(" ")[1];
  }

  return null;
}

export async function validateAuthToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = getAuthToken(req);
  if (!token) {
    res.status(HttpStatusCode.BadRequest).end();
    return;
  }
  const account = await getAccountFromAuth(token);

  if (account === null) {
    res.status(HttpStatusCode.Unauthorized).end();
  } else {
    // truthy return values are interpreted as auth success
    // you can also add any auth information to the return value
    req.headers["publicKey"] = account.publicKey;
    req.headers["msaId"] = account.msaId;
    next();
  }
}
