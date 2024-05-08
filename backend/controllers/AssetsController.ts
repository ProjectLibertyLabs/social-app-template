import { Express, Request, Response } from "express";
import { BaseController } from "./BaseController";
import * as AssetsHandler from "../handlers/AssetsHandler";
import { HttpStatusCode } from "axios";
import { HttpError } from "../types/HttpError";

export class AssestsController extends BaseController {
  constructor(app: Express) {
    super(app, "/v2/assets");
  }

  protected initializeRoutes(): void {
    this.router.post("/", this.postAssets.bind(this));
  }

  public async postAssets(req: Request, res: Response) {
    try {
      const response = await AssetsHandler.postAssetsHandler(req);
      res.status(HttpStatusCode.Created).send(response);
    } catch (err: any) {
      console.error(err.message);
      if (err instanceof HttpError) {
        return res.status(err.code).send(err.message);
      }

      return res.status(HttpStatusCode.InternalServerError).send(err.message);
    }
  }
}
