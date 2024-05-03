import { Express } from "express";
import { BaseController } from "./BaseController";

export class ContentController extends BaseController {
  constructor(app: Express) {
    super(app, "/content");
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.get("/", this.getContent.bind(this));
    this.router.get(
      "/:dsnpId/:contentHash",
      this.getSpecificUserContent.bind(this),
    );
    this.router.put(
      "/:contentType/:contentHash",
      this.getSpecificUserContent.bind(this),
    );
    this.router.get("/feed", this.getContentFeed.bind(this));
    this.router.get("/discover", this.getContentDiscover.bind(this));
    this.router.post("/create", this.postContentCreate.bind(this));
  }

  public getContent() {}

  public getContentFeed() {}

  public getContentDiscover() {}

  public postContentCreate() {}

  public getSpecificUserContent() {}

  public putSpecificContentType() {}
}
