import { Client as AccountServiceClient, type Components } from '../types/openapi-account-service';
import { OpenAPIClientAxios, type Document } from 'openapi-client-axios';
import openapiJson from '../openapi-specs/account.openapi.json' assert { type: 'json' };
import { WalletProxyResponse, validateSignin, validateSignup } from '@projectlibertylabs/siwf';
import { createAuthToken, getAuthToken, revokeAuthToken } from './TokenAuth';
import { getApi } from './frequency';
import * as Config from '../config/config';
import { HttpStatusCode } from 'axios';
import { HttpError } from '../types/HttpError';
import { Request } from 'express';
import logger from '../logger';
import * as AccountServiceWebhook from './AccountWebhookService';
import { Components as BackendComponents } from '../types/api';
import { SIWFWebhookRsp, TransactionType } from '../types/account-service-webhook';

type AuthAccountResponse = BackendComponents.Schemas.AuthAccountResponse;
type WalletLoginRequestDto = Components.Schemas.WalletLoginRequestDto;
type WalletLoginConfigResponse = Components.Schemas.WalletLoginConfigResponseDto;
type WalletLoginResponse = Components.Schemas.WalletLoginResponseDto;
type WalletV2RedirectResponseDto = Components.Schemas.WalletV2RedirectResponseDto;
type VerfifyAuthRequestDto = Components.Schemas.WalletV2LoginRequestDto;
type AccountResponse = Components.Schemas.AccountResponseDto;

/**
 * The `AccountService` class provides methods for interacting with user accounts.
 * It handles operations such as retrieving account information, signing in or signing up users,
 * and managing authentication tokens. It uses the Account-Service RESTful API to perform these operations.
 */
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

  /**
   * Retrieves the SIWF configuration for wallet login.
   * @returns A promise that resolves to a `WalletLoginConfigResponse` object.
   * @throws If there was an error retrieving the SWIF config.
   */
  public async getSWIFConfig(): Promise<WalletLoginConfigResponse> {
    try {
      const response = await this.client.AccountsControllerV1_getSIWFConfig();
      return response.data;
    } catch (e) {
      logger.error('Failed to get SIWF config: ', e);
      throw e;
    }
  }

  /**
   * Retrieves the account information for a given MSA ID.
   * @param msaId - The MSA ID of the account to retrieve.
   * @returns A Promise that resolves to an AuthAccountResponse object containing the account information.
   * @throws If there was an error retrieving the account information.
   */
  public async getAccount(msaId: string): Promise<Pick<AuthAccountResponse, 'msaId' | 'handle'>> {
    try {
      const response = await this.client.AccountsControllerV1_getAccountForMsa(msaId);
      logger.debug(
        `AccountService: getAccount: Got account for msaID:(${msaId}), data:(${JSON.stringify(response.data)})`
      );
      return {
        msaId: msaId,
        handle: response.data.handle as AuthAccountResponse['handle'],
      };
    } catch (e) {
      logger.error(`Failed to get account for msaID:(${msaId}) error:${e}`);
      throw e;
    }
  }

  public async getAccountByAccountId(accountId: string): Promise<AccountResponse> {
    try {
      const {
        data: { msaId, handle },
      } = await this.client.AccountsControllerV1_getAccountForAccountId(accountId);

      return {
        msaId,
        handle: handle as AuthAccountResponse['handle'],
      };
    } catch (e) {
      throw new HttpError(HttpStatusCode.NotFound, `Account not found with referenceId:(${accountId})`, {
        cause: e,
      });
    }
  }

  /**
   * Retrieves an account based on the provided reference ID.
   * @param referenceId - The reference ID used to correlate the data from the blockchain transaction to the account.
   * @returns A Promise that resolves to an AuthAccountResponse object if the account is found, or undefined if not found.
   * @throws Throws an error if there was an issue retrieving the account.
   */
  public async getAccountByReferenceId(
    referenceId: string
  ): Promise<Pick<AuthAccountResponse, 'msaId' | 'handle'> | undefined> {
    // In this case, we're using the referenceId to get the account
    // Check the webhook and see if the referenceId has been processed
    logger.debug(`AccountService: getAccountByReferenceId: Looking for account for referenceId:(${referenceId})`);
    try {
      const accountData = AccountServiceWebhook.referenceIdsReceived.get(referenceId);
      logger.debug(`Got reference payload for id ${referenceId}: ${JSON.stringify(accountData)}`);
      if (accountData) {
        if (accountData.transactionType === TransactionType.SIWF_SIGNUP) {
          const siwfData = accountData as SIWFWebhookRsp;
          // REMOVE: When account service webhook is fixed to return the HandleResponse
          const response = await this.client.AccountsControllerV1_getAccountForMsa(accountData.msaId);
          // END REMOVE:
          logger.debug(`Found account for referenceId:(${referenceId})`);
          return {
            msaId: siwfData.msaId,
            handle: response.data.handle as AuthAccountResponse['handle'],
          };
        } else {
          throw new Error(`Unable to get accountId associated with reference ${referenceId}`);
        }
      }
    } catch (e) {
      logger.error(`Failed to get account for referenceId:(${referenceId}) error:${e}`);
      throw e;
    }
  }

  /**
   * Signs in or signs up a user based on the provided request.
   * If `signUp` is true, it will sign up the user. If `signIn` is true, it will sign in the user.
   * @param request - The request object containing the necessary information for signing in or signing up.
   * @returns A promise that resolves to a `WalletLoginResponse` object.
   * @throws If there is an error during the sign in or sign up process.
   */
  public async signInOrSignUp(request: WalletProxyResponse): Promise<WalletLoginResponse> {
    const { signIn, signUp } = request;
    let response: Partial<WalletLoginResponse> = {};
    try {
      if (signUp) {
        response = await this.signUp(request);
        return response as WalletLoginResponse;
      } else if (signIn) {
        response = await this.signIn(request);
      }
      return response as WalletLoginResponse;
    } catch (e) {
      logger.error('Failed to sign in or sign up: ', e);
      throw e;
    }
  }

  async verifyFrequencyAccessAuth(params: VerfifyAuthRequestDto): Promise<any> {
    try {
      const response = await this.client.AccountsControllerV2_postSignInWithFrequency(null, params);

      const { controlKey, msaId } = response.data;

      return {
        accessToken: createAuthToken(controlKey),
        expires: Date.now() + 24 * 60 * 60 * 1_000,
        msaId: msaId,
        controlKey,
      };
    } catch (e) {
      throw new HttpError(HttpStatusCode.Unauthorized, 'Failed to verify auth code:', {
        cause: e,
      });
    }
  }

  async initiateSignInWithFrequencyAccess(params: any): Promise<WalletV2RedirectResponseDto> {
    try {
      const response = await this.client.AccountsControllerV2_getRedirectUrl(params, null);
      return response.data;
    } catch (e) {
      logger.error('Failed to get redirect URL: ', e);
      throw e;
    }
  }

  /**
   * Signs up a user based on the provided SIWF payload.
   * @param payload - The SIWF payload containing the signup information.
   * @returns A Promise that resolves to an object with the referenceId, accessToken, and expires properties.
   * @throws {HttpError} If the signup payload is invalid or if signup validation fails.
   */
  public async signUp(payload: WalletProxyResponse): Promise<any> {
    const chainApi = await getApi();
    const { signUp } = payload;

    if (!signUp) {
      throw new HttpError(HttpStatusCode.BadRequest, 'Invalid signup payload');
    }
    try {
      const { publicKey } = await validateSignup(chainApi, signUp, Config.instance().providerId);
      const response = await this.client.AccountsControllerV1_postSignInWithFrequency(
        null,
        payload as WalletLoginRequestDto
      );

      logger.debug(`AccountService: signUp: Account signup processed, referenceId: ${response.data.referenceId}`);
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

  /**
   * Sign in a user with the provided SIWF payload.
   * @param payload - The SIWF payload containing the sign-in information.
   * @returns A Promise that resolves to an object containing the access token, expiration time, and MSA ID.
   * @throws {HttpError} If the sign-in fails or the payload is invalid.
   */
  public async signIn(payload: WalletProxyResponse): Promise<any> {
    const chainApi = await getApi();
    const { signIn } = payload;

    if (signIn) {
      try {
        const { msaId, publicKey } = await validateSignin(chainApi, signIn, 'projectlibertylabs.github.io');
        return {
          accessToken: createAuthToken(publicKey),
          expires: Date.now() + 24 * 60 * 60 * 1_000,
          msaId: msaId,
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

  /**
   * Logs out the user by revoking the authentication token.
   * @param req - The request object, containing the authentication token.
   */
  public logout(req: Request) {
    const authToken = getAuthToken(req);
    if (authToken) {
      revokeAuthToken(authToken);
    }
  }
}
