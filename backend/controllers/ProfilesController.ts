import { Express, Request, Response } from "express";
import { BaseController } from "./BaseController";
import { HttpStatusCode } from "axios";

export class ProfilesController extends BaseController {
  constructor(app: Express) {
    super(app, "/profiles");
  }

  protected initializeRoutes(): void {
    this.router.get("/:dsnpId", this.getProfile.bind(this));
    this.router.put("/:dsnpId", this.putProfile.bind(this));
  }

  public getProfile(_req: Request, res: Response) {
    return res.status(HttpStatusCode.Ok).send();
  }
  public putProfile(_res: Request, res: Response) {
   return res.status(HttpStatusCode.Accepted).send();
  }
}
