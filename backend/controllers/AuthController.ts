import { Express, Request, Response } from 'express';
import { BaseController } from './BaseController';
import { AccountService } from '../services/AccountService';
import { validateAuthToken } from '../services/TokenAuth';
import { HttpError } from '../types/HttpError';
import { HttpStatusCode } from 'axios';
import * as Config from '../config/config';
import logger from '../logger';

interface AccountQueryParams {
  msaId?: string;
  referenceId?: string;
  accountId?: string;
}

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
    this.router.get('/login/v2/siwf', this.getLoginV2Swif.bind(this));
    this.router.post('/login/v2/siwf/verify', this.postLoginV2Swif.bind(this));
    this.router.post('/logout', validateAuthToken, this.postLogout.bind(this));
  }

  private validateQueryParams(params: AccountQueryParams): string | null {
    const { msaId, referenceId, accountId } = params;
    if (!msaId && !referenceId && !accountId) {
      return 'msaId, referenceId, or accountId is required';
    }
    return null;
  }

  public async postLoginV2Swif(req: Request, res: Response) {
    try {
      const payload = await AccountService.getInstance().then((service) => service.verifyFrequencyAccessAuth(req.body));

      console.log('payload', payload);
      res.json(payload);
    } catch (e) {
      if (e instanceof HttpError) {
        res.status(e.code).send(e.message).end();
      } else {
        res.status(HttpStatusCode.InternalServerError).send(e).end();
      }
    }
  }

  public async getLoginV2Swif(req: Request, res: Response) {
    try {
      const HOSTNAME = 'localhost';
      const PORT = Config.instance().port;
      const SIWF_CALLBACK = `http://${HOSTNAME}:${PORT}/login/callback`;

      const params = {
        callbackUrl: SIWF_CALLBACK,
        credentials: ['VerifiedGraphKeyCredential', 'VerifiedEmailAddressCredential', 'VerifiedPhoneNumberCredential'],
        permissions: [
          'dsnp.profile@v1',
          'dsnp.public-key-key-agreement@v1',
          'dsnp.public-follows@v1',
          'dsnp.private-follows@v1',
          'dsnp.private-connections@v1',
        ],
      };

      const payload = await AccountService.getInstance().then((service) =>
        service.initiateSignInWithFrequencyAccess(params)
      );
      res.json(payload);
    } catch (e) {
      if (e instanceof HttpError) {
        res.status(e.code).send(e.message).end();
      } else {
        res.status(HttpStatusCode.InternalServerError).send(e).end();
      }
    }
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
    try {
      const queryParams = {
        msaId: req.query?.['msaId']?.toString() || '',
        referenceId: req.query?.['referenceId']?.toString() || '',
        accountId: req.query?.['accountId']?.toString() || '',
      };

      logger.debug(
        `AuthController:getAccount: msaId: ${queryParams.msaId}, referenceId: ${queryParams.referenceId}, accountId: ${queryParams.accountId}`
      );

      const validationError = this.validateQueryParams(queryParams);

      if (validationError) {
        return res.status(HttpStatusCode.BadRequest).json({
          error: validationError,
        });
      }

      const accountService = await AccountService.getInstance();

      const { msaId, referenceId, accountId } = queryParams;

      if (msaId) {
        const data = await accountService.getAccount(msaId);
        return res.status(HttpStatusCode.Ok).send(data);
      }

      if (accountId) {
        const data = await accountService.getAccountByAccountId(accountId);
        return res.status(HttpStatusCode.Ok).send(data);
      }

      // Get the account information based on the referenceId
      // The Front End is asking if we have finished a user login or registration
      const data = await accountService.getAccountByReferenceId(referenceId);
      logger.debug(`AuthController:getAccount: data: ${JSON.stringify(data)}`);

      if (!data) {
        return res.status(HttpStatusCode.Accepted).send({
          message: 'Registration/login process is still in progress',
        });
      }

      return res.status(HttpStatusCode.Ok).send(data);
    } catch (error) {
      logger.error(`AuthController:getAccount: Error: ${error}`);

      if (error instanceof HttpError) {
        return res.status(error.code).send(error.message);
      }

      return res.status(HttpStatusCode.InternalServerError).send({
        message: 'An error occurred while retrieving the account',
      });
    }
  }

  /**
   * Handles the POST request for SIWF user login or registration.
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
