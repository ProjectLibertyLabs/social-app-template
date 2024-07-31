import { Express, Request, Response } from 'express';
import { BaseController } from './BaseController';
import { AccountService } from '../services/AccountService';
import { validateAuthToken } from '../services/TokenAuth';
import { HttpError } from '../types/HttpError';
import { HttpStatusCode } from 'axios';
import * as Config from '../config/config';
import logger from '../logger';

/**
 * Controller class for handling authentication-related routes.
 */
export class AuthController extends BaseController {
  constructor(app: Express) {
    super(app, '/auth');
  }

  protected initializeRoutes(): void {
    this.router.get('/siwf', this.getSiwf.bind(this));
    this.router.get('/account', this.getAccount.bind(this));
    this.router.post('/login', this.postLogin.bind(this));
    this.router.post('/logout', validateAuthToken, this.postLogout.bind(this));
  }

  /**
   * Retrieves the SIWF configuration and sends the response to the client.
   * @param req - The request object, not used in this method.
   * @param res - The response object.
   */
  public async getSiwf(_req: Request, res: Response) {
    const payload = await AccountService.getInstance().then((service) => service.getSWIFConfig());
    if (!payload) {
      res.status(HttpStatusCode.InternalServerError).send('Failed to get siwf config').end();
      return;
    }
    res
      .status(HttpStatusCode.Ok)
      .send({
        siwfUrl: payload.siwfUrl,
        nodeUrl: payload.frequencyRpcUrl,
        ipfsGateway: Config.instance().ipfsUserAgentGatewayUrl,
        providerId: payload.providerId,
        schemas: [1, 2, 3, 4, 5, 6, 8],
        network: Config.instance().chainType,
      })
      .end();
  }

  /**
   * Retrieves the account information based on the provided request headers.
   * @param req - The request object. The request headers must contain the msaId or the referenceId.
   * @param res - The response object.
   * @returns The account information: handle and msaId.
   */
  public async getAccount(req: Request, res: Response) {
    // Check if msaId or referenceId is provided in the request headers
    const msaId = req.query?.['msaId']?.toString() || '';
    const referenceId = req.query?.['referenceId']?.toString() || '';
    logger.debug(`AuthController:getAccount: msaId: ${msaId}, referenceId: ${referenceId}`);

    if (!msaId && !referenceId) {
      res = res.status(HttpStatusCode.BadRequest).send('msaId or referenceId is required');
    }

    let data;
    if (msaId) {
      // Get the account information based on the msaId
      data = await AccountService.getInstance().then((service) => service.getAccount(msaId));
      res.status(HttpStatusCode.Ok).send(data);
    } else {
      // Get the account information based on the referenceId
      // The Front End is asking if we have finished a user Login or registration
      // We should return a 202 if we have not finished the registration
      // If the transaction has been finalized, the webhook will have received the information, for the referenceId.
      data = await AccountService.getInstance().then((service) => service.getAccountByReferenceId(referenceId));
      logger.debug(`AuthController:getAccount: data: ${JSON.stringify(data)}`);
      res = res.status(HttpStatusCode.Ok).send(data);
    }
    res.end();
  }

  /**
   * Handles the POST request for SIWF user Login or registration.
   * @param req - The request object of type `WalletLoginRequest`.
   * @param res - The response object of type `WalletLoginResponse`.
   */
  public async postLogin(req: Request, res: Response) {
    try {
      const response = await AccountService.getInstance().then((service) => service.signInOrSignUp(req.body));
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
