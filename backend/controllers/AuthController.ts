import { Express, Request, Response } from "express";
import { BaseController } from "./BaseController";
import * as AuthHandler from '../handlers/AuthHandler';
import { AuthService } from '../services/AuthService';
import { validateAuthToken } from "../services/TokenAuth";
import { HttpError } from "../types/HttpError";
import { HttpStatusCode } from "axios";

export class AuthController extends BaseController {
  constructor(app: Express) {
    super(app, "/auth");
  }

  protected initializeRoutes(): void {
    this.router.get("/siwf", this.getSiwf.bind(this));
    this.router.get("/account", validateAuthToken, this.getAccount.bind(this));
    this.router.post("/login", this.postLogin.bind(this));
    this.router.post("/logout", validateAuthToken, this.postLogout.bind(this));
  }

  public getSiwf(_req: Request, res: Response) {
    const payload = AuthHandler.getSiwfRequestConfig();
    res.send(payload).status(200).end();
  }

  public async getAccount(req: Request, res: Response) {
    const data = await AuthService.instance().then(service => service.getAccount(req));
    if (!data?.displayHandle || !data?.dsnpId) {
        res = res.status(HttpStatusCode.Accepted);
    } else {
        res.status(HttpStatusCode.Ok).send(data);
    }
    res.end();
  }

  public async postLogin(req: Request, res: Response) {
    try {
    const response = await AuthService.instance().then(service => service.signIn(req.body));
    res.send(response).end();
    } catch (e) {
        if (e instanceof HttpError) {
            res.status(e.code).send(e.message).end();
        } else {
            res.status(HttpStatusCode.InternalServerError).send(e).end();
        }
    }
  }

  public postLogout(_req: Request, res: Response) {
    res.status(HttpStatusCode.Created);
  }
}
