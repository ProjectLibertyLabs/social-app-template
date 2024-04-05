import { Context, Handler } from "openapi-backend";
import type { Request, Response } from "express";
import type { PostBroadcastRequest } from "../../types/types.js";
import { getMsaByPublicKey } from "../../services/auth.js";
import { BroadcastService } from "../../services/BroadcastService.js";

export const postBroadcastHandler: Handler<PostBroadcastRequest> = async (
  c: Context<PostBroadcastRequest>,
  req: Request,
  res: Response,
) => {
  try {
    const msaId =
      c.security.tokenAuth.msaId ||
      (await getMsaByPublicKey(c.security.tokenAuth.publicKey));

    const broadcast = await BroadcastService.create(
      msaId,
      c.request.requestBody,
    );

    return res.status(202).json(broadcast);
  } catch (e) {
    console.error(e);
    return res.status(503).json(c.validation.errors);
  }
};
