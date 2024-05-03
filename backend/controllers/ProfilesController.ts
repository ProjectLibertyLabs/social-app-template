import { Express } from "express";
import { BaseController } from "./BaseController";

export class ProfilesController extends BaseController {
  constructor(app: Express) {
    super(app, "/profiles");
  }

  protected initializeRoutes(): void {
    this.router.get("/:dsnpId", this.getProfile.bind(this));
    this.router.put("/:dsnpId", this.putProfile.bind(this));
  }

  public getProfile() {}
  public putProfile() {}
}
