import { Client as AccountServiceClient, type Components } from '../types/openapi-account-service';
import { OpenAPIClientAxios, type Document } from 'openapi-client-axios';
import openapiJson from '../openapi-specs/account-service.json' assert { type: 'json' };
import { WalletProxyResponse, validateSignin, validateSignup } from '@amplica-labs/siwf';
import { createAuthToken, getAuthToken, revokeAuthToken } from './TokenAuth';
import { getApi, getNonce, getProviderKey } from './frequency';
import * as Config from '../config/config';
import { HttpStatusCode } from 'axios';
import { HttpError } from '../types/HttpError';
import { Request } from 'express';
import logger from '../logger';
import { WebhookController } from '../controllers/WebhookController';

type AccountResponse = Components.Schemas.AccountResponse;
type WalletLoginRequestDto = Components.Schemas.WalletLoginRequestDto;
type SignUpResponseDto = Components.Schemas.SignUpResponseDto;
type SignInResponseDto = Components.Schemas.SignInResponseDto;
type WalletLoginConfigResponse = Components.Schemas.WalletLoginConfigResponse;
type WalletLoginResponse = Components.Schemas.WalletLoginResponse;

export class AccountService {
  private static instance: AccountService;
  private _client: AccountServiceClient;

  private constructor() {}

  public static async getInstance(): Promise<AccountService> {
    if (!AccountService.instance) {
      AccountService.instance = new AccountService();
      await AccountService.instance.connect();
    }
    return AccountService.instance;
  }

  private async connect() {
    if (this._client === undefined) {
      const api = new OpenAPIClientAxios({
        definition: openapiJson as Document,
        withServer: { url: Config.instance().accountServiceUrl },
      });
      this._client = await api.init<AccountServiceClient>();
    }
  }

  private set client(api: AccountServiceClient) {
    this._client = api;
  }

  private get client() {
    if (this._client === undefined) {
      throw new Error(`${this.constructor.name} API not initialized`);
    }
    return this._client;
  }

  public async getSWIFConfig(): Promise<WalletLoginConfigResponse> {
    try {
      const response = await this.client.AccountsController_getSIWFConfig();
      return response.data;
    } catch (e) {
      logger.error('Failed to get SIWF config: ', e);
      throw e;
    }
  }

  public async getAccount(msaId: string): Promise<AccountResponse> {
    try {
      const response = await this.client.AccountsController_getAccount(msaId);
      logger.debug(`Got account for msaID:(${msaId}), data:(${JSON.stringify(response.data)})`);
      // return response.data;
      return {
        msaId: parseInt(msaId),
        displayHandle: response.data.displayHandle,
      };
    } catch (e) {
      logger.error(`Failed to get account for msaID:(${msaId}) error:${e}`);
      throw e;
    }
  }

  public async getAccountByReferenceId(referenceId: string): Promise<AccountResponse | undefined> {
    // In this case, we're using the referenceId to get the account
    // Check the webhook and see if the referenceId has been processed
    logger.debug(`Looking for account for referenceId:(${referenceId})`);
    try {
      const accountData = WebhookController.referenceIdsReceived.get(referenceId);
      if (accountData) {
        logger.debug(`Found account for referenceId:(${referenceId})`);
        // We need accountId/publicKey to create the authToken
        return {
          accessToken: createAuthToken(accountData.accountId),
          expires: Date.now() + 24 * 60 * 60 * 1_000,
          referenceId: referenceId,
          msaId: parseInt(accountData.msaId),
          displayHandle: accountData.displayHandle,
        };
      }
    } catch (e) {
      logger.error(`Failed to get account for referenceId:(${referenceId}) error:${e}`);
      throw e;
    }
  }

  public async signInOrSignUp(request: WalletLoginRequestDto): Promise<WalletLoginResponse> {
    const { signIn, signUp } = request;
    let response: Partial<WalletLoginResponse> = {};
    try {
      if (signUp) {
        // REMOVE: This is just for debugging
        logger.debug('AuthService: signInOrSignUp: Signing up');
        response = await AccountService.getInstance().then((service) => service.signUp(request));
        return response as WalletLoginResponse;
      } else if (signIn) {
        // REMOVE: This is just for debugging
        logger.debug('AuthService: signInOrSignUp: Signing in');
        response = await AccountService.getInstance().then((service) => service.signIn(request));
      }
      return response as WalletLoginResponse;
    } catch (e) {
      logger.error('Failed to sign in or sign up: ', e);
      throw e;
    }
  }

  public async signUp(payload: WalletLoginRequestDto): Promise<any> {
    const api = await getApi();
    const { signUp } = payload;
    // TODO: typescript hates optional and undefined
    if (!signUp) {
      throw new HttpError(HttpStatusCode.BadRequest, 'Invalid signup payload');
    }
    try {
      logger.debug(signUp, 'validateSignup: signUp:');
      const { calls, publicKey } = await validateSignup(api, signUp, Config.instance().providerId);
      logger.debug('publicKey from validateSignup: %s', publicKey);
      const response = await this.client.AccountsController_postSignInWithFrequency(null, payload);

      // REMOVE: This is just for debugging
      logger.debug('Account signup processed, referenceId: %s', response.data.referenceId);
      // TODO: the real data is in the webhook response
      return {
        referenceId: response.data.referenceId,
        accessToken: createAuthToken(publicKey),
        expires: Date.now() + 24 * 60 * 60 * 1_000,
      };
    } catch (e: any) {
      logger.error('Failed signup validation', e);
      throw new HttpError(HttpStatusCode.Unauthorized, 'Failed signup validation', {
        cause: e,
      });
    }
  }

  public async signIn(payload: WalletProxyResponse): Promise<any> {
    const api = await getApi();
    const { signIn } = payload;

    logger.debug(signIn, 'AuthService:signIn:');
    // TODO: typescript hates optional and undefined
    if (signIn) {
      try {
        const parsedSignin = await validateSignin(api, signIn, 'amplicalabs.github.io');
        return {
          accessToken: createAuthToken(parsedSignin.publicKey),
          expires: Date.now() + 24 * 60 * 60 * 1_000,
          msaId: parsedSignin.msaId,
        };
      } catch (e) {
        logger.error('Failed signin: ', e);
        throw new HttpError(HttpStatusCode.Unauthorized, 'Failed signin', {
          cause: e,
        });
      }
    }

    // Shouldn't get here
    throw new HttpError(HttpStatusCode.BadRequest, 'Invalid signin payload');
  }

  public logout(req: Request) {
    const authToken = getAuthToken(req);
    if (authToken) {
      revokeAuthToken(authToken);
    }
  }
}
