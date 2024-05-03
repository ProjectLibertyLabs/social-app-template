import { Express, Request, Response } from "express";
import { BaseController } from "./BaseController";
import * as AuthHandler from '../handlers/AuthHandler';

export class AuthController extends BaseController {
  constructor(app: Express) {
    super(app, "/auth");
  }

  protected initializeRoutes(): void {
    this.router.get("/siwf", this.getSiwf.bind(this));
    this.router.get("/account", this.getAccount.bind(this));
    this.router.post("/login", this.postLogin.bind(this));
    this.router.post("/logout", this.postLogout.bind(this));
  }

  public getSiwf(req: Request, res: Response) {
    const payload = AuthHandler.getSiwfRequestConfig();
    res.send(payload).status(200).end();
  }

  public getAccount() {}

  public postLogin() {}

  public postLogout(req: Request, res: Response) {
    res.status(201);
  }
}
