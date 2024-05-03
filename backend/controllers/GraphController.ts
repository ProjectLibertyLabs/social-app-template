import { Express } from "express";
import { BaseController } from "./BaseController";

export class GraphController extends BaseController {
  constructor(app: Express) {
    super(app, "/graph");
  }

  protected initializeRoutes(): void {
    this.router.get("/:dsnpId/following", this.getFollowing.bind(this));
    this.router.post("/:dsnpId/follow", this.postFollow.bind(this));
    this.router.post("/:dsnpId/unfollow", this.postUnfollow.bind(this));
  }

  public getFollowing() {}
  public postFollow() {}
  public postUnfollow() {}
}
