import { Handler } from "openapi-backend";
import type * as T from "../types/openapi.js";
import { getMsaByPublicKey } from "../services/auth.js";
import { follow, getPublicFollows, unfollow } from "../services/graph.js";

export const userFollowing: Handler<object> = async (c, _req, res) => {
  const msaId = c.request.params.dsnpId;

  if (typeof msaId !== "string") {
    return res.status(404).send();
  }

  try {
    const follows = await getPublicFollows(msaId);

    const response: T.Paths.UserFollowing.Responses.$200 = follows;
    return res.status(200).json(response);
  } catch (e) {
    console.error("Error getting user followers", e);
    return res.status(500).send();
  }
};

export const graphFollow: Handler<object> = async (c, _req, res) => {
  const msaId =
    c.security.tokenAuth.msaId ||
    (await getMsaByPublicKey(c.security.tokenAuth.publicKey));
  const objectMsaId = c.request.params.dsnpId;

  if (typeof objectMsaId !== "string") {
    return res.status(404).send();
  }

  try {
    await follow(msaId, parseInt(objectMsaId));

    return res.status(201).send();
  } catch (e) {
    console.error("Error changing graph: follow", e);
    return res.status(500).send();
  }
};

export const graphUnfollow: Handler<object> = async (c, _req, res) => {
  const msaId =
    c.security.tokenAuth.msaId ||
    (await getMsaByPublicKey(c.security.tokenAuth.publicKey));
  const objectMsaId = c.request.params.dsnpId;

  if (typeof objectMsaId !== "string") {
    return res.status(404).send();
  }

  try {
    await unfollow(msaId, parseInt(objectMsaId));

    return res.status(201).send();
  } catch (e) {
    console.error("Error changing graph: unfollow", e);
    return res.status(500).send();
  }
};
