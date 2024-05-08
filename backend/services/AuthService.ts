import {
  Client as AccountServiceClient,
  type Components,
} from "../types/openapi-account-service";
import { OpenAPIClientAxios, type Document } from "openapi-client-axios";
import openapiJson from "../openapi-specs/account-service.json" assert { type: "json" };
import {
  WalletProxyResponse,
  validateSignin,
  validateSignup,
} from "@amplica-labs/siwf";
import { createAuthToken, getAuthToken, revokeAuthToken } from "./TokenAuth";
import { getApi, getNonce, getProviderKey } from "./frequency";
import * as Config from "../config/config";
import { HttpStatusCode } from "axios";
import { HttpError } from "../types/HttpError";
import { Request } from "express";

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
      console.error("Failed to get SIWF config: ", e);
      throw e;
    }
  }

  public async getAccount(msaId: string): Promise<AccountResponse> {
    try {
      const response = await this.client.AccountsController_getAccount(msaId);
      return response.data;
    } catch (e) {
      console.error(`Failed to get account for msaID:${msaId}  error:${e}`);
      throw e;
    }
  }

  public async signInOrSignUp(
    request: WalletLoginRequestDto,
  ): Promise<WalletLoginResponse> {
    const { signIn, signUp } = request;
    let response: Partial<WalletLoginResponse> = {};
    try {
      if (signUp) {
        response = await AccountService.getInstance().then((service) =>
          service.signUp(request),
        );
        return response as WalletLoginResponse;
      } else if (signIn) {
        // REMOVE: This is just for debugging
        console.log("Signing in");
        response = await AccountService.getInstance().then((service) =>
          service.signIn(request),
        );
      }
      return response as WalletLoginResponse;
    } catch (e) {
      console.error("Failed to sign in or sign up: ", e);
      throw e;
    }
  }

  public async signUp(payload: WalletLoginRequestDto): Promise<any> {
    const api = await getApi();
    const { signUp } = payload;
    // TODO: typescript hates optional and undefined
    if (!signUp) {
      throw new HttpError(HttpStatusCode.BadRequest, "Invalid signup payload");
    }
    try {
      console.log(`validateSignup: ${JSON.stringify(signUp, null, 2)}`);
      const { calls, publicKey } = await validateSignup(
        api,
        signUp,
        Config.instance().providerId,
      );
      console.log(`publicKey from validateSignup: ${publicKey}`);
      const response =
        await this.client.AccountsController_postSignInWithFrequency(
          null,
          payload,
        );

      // REMOVE: This is just for debugging
      console.log(
        `Account signup processed, referenceId: ${response.data.referenceId}`,
      );
      // TODO: the real data is in the webhook response
      return {
        accessToken: createAuthToken(publicKey),
        expires: Date.now() + 24 * 60 * 60 * 1_000,
      };
    } catch (e: any) {
      console.error("Failed signup validation", e);
      throw new HttpError(
        HttpStatusCode.Unauthorized,
        "Failed signup validation",
        { cause: e },
      );
    }
  }

  public async signIn(payload: WalletProxyResponse): Promise<any> {
    const api = await getApi();
    const { signIn } = payload;

    // TODO: typescript hates optional and undefined
    console.log(`Signin: ${JSON.stringify(signIn, null, 2)}`);
    if (signIn) {
      try {
        const parsedSignin = await validateSignin(
          api,
          signIn,
          "amplicalabs.github.io",
        );
        return {
          accessToken: createAuthToken(parsedSignin.publicKey),
          expires: Date.now() + 24 * 60 * 60 * 1_000,
        };
      } catch (e) {
        console.error("Failed signin: ", e);
        throw new HttpError(HttpStatusCode.Unauthorized, "Failed signin", {
          cause: e,
        });
      }
    }

    // Shouldn't get here
    throw new HttpError(HttpStatusCode.BadRequest, "Invalid signin payload");
  }

  public logout(req: Request) {
    const authToken = getAuthToken(req);
    if (authToken) {
      revokeAuthToken(authToken);
    }
  }
}
