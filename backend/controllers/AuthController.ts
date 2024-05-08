import { Express, Request, Response } from "express";
import { BaseController } from "./BaseController";
import * as AuthHandler from "../handlers/AuthHandler";
import { AccountService } from "../services/AuthService";
import { validateAuthToken } from "../services/TokenAuth";
import { HttpError } from "../types/HttpError";
import { HttpStatusCode } from "axios";
// REMOVE:
import * as Config from "../config/config";

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

  public async getSiwf(_req: Request, res: Response) {
    console.log("AuthController:getSiwf");
    const payload = await AccountService.getInstance().then((service) =>
      service.getSWIFConfig(),
    );
    if (!payload) {
      res
        .status(HttpStatusCode.InternalServerError)
        .send("Failed to get siwf config")
        .end();
      return;
    }
    // REMOVE: This is just for debugging
    console.log(
      `AuthController:getSiwf config payload: ${JSON.stringify(payload, null, 2)}`,
    );
    res
      .status(HttpStatusCode.Ok)
      .send({
        siwfUrl: payload.siwfUrl,
        nodeUrl: payload.frequencyRpcUrl,
        ipfsGateway: "http://kubo_ipfs:8080",
        providerId: payload.providerId,
        schemas: [1, 2, 3, 4, 5, 6, 8],
        network: Config.instance().chainType,
      })
      .end();
    // REMOVE:
    // res.status(HttpStatusCode.Ok).send(payload).end();
  }

  public async getAccount(req: Request, res: Response) {
    // REMOVE:
    console.log("AuthController:getAccount");
    const msaId =
      typeof req.headers?.["msaId"] === "string" ? req.headers?.["msaId"] : "";
    const data = await AccountService.getInstance().then((service) =>
      service.getAccount(msaId),
    );
    if (!data?.handle || !data?.msaId) {
      res = res.status(HttpStatusCode.Accepted);
    } else {
      res.status(HttpStatusCode.Ok).send(data);
    }
    res.end();
  }

  public async postLogin(req: Request, res: Response) {
    try {
      const response = await AccountService.getInstance().then((service) =>
        service.signInOrSignUp(req.body),
      );
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
