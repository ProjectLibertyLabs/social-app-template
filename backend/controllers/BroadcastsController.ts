import { Express, Request, Response } from "express";
import { BaseController } from "./BaseController";
import * as BroadcastsHandler from "../handlers/BroadcastsHandler";
import { HttpStatusCode } from "axios";
import { HttpError } from "../types/HttpError";
import {
  RequestAccount,
  validateAuthToken,
  validateMsaAuth,
} from "../services/TokenAuth";
// uncomment below for easy dev/debug usage
// import { RequestAccount, debugAuthToken as validateAuthToken, debugMsaAuth as validateMsaAuth } from "../services/TokenAuth";

export class BroadcastsController extends BaseController {
  constructor(app: Express) {
    super(app, "/v2/broadcasts");
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.post(
      "/",
      validateAuthToken,
      validateMsaAuth,
      this.postBroadcast.bind(this),
    );
  }

  public async postBroadcast(req: Request, res: Response) {
    const { msaId } = req.headers as RequestAccount;
    try {
      const response = await BroadcastsHandler.postBroadcastHandler(
        msaId!,
        req.body,
      );
      return res.status(HttpStatusCode.Created).send(response);
    } catch (err: any) {
      console.error("Error posting broadcast: ", err);
      if (err instanceof HttpError) {
        return res.status(err.code).send(err.message);
      }
      return res.status(HttpStatusCode.InternalServerError).send(err?.message);
    }
  }
}
