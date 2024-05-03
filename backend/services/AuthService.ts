import { Client, type Components } from '../types/openapi-account-service';
import { OpenAPIClientAxios, OperationResponse, type Document } from 'openapi-client-axios';
import openapiJson from '../openapi-specs/account-service.json' assert { type: 'json' };
import { WalletProxyResponse } from '@amplica-labs/siwf';
import { createAuthToken } from './auth';

type SiwfRequest = Components.Schemas.WalletLoginRequestDto;
type SiwfResponse = Components.Schemas.WalletLoginResponse;

export class AuthService {
    private static _instance: AuthService;

    private _client: Client;

    private constructor() {
    }

    public static async instance() {
        if (!this._instance) {
            this._instance = new this();
            await this._instance.connect();
        }

        return this._instance;
    }

    private get client() {
        if (!this._client) {
            throw new Error(`${this.constructor.name} API not initialized`);
        }

        return this._client;
    }

    private async connect() {
        if (!this._client) {
            const api = new OpenAPIClientAxios({ definition: openapiJson as Document })
            this._client = await api.init<Client>();
        }
    }

    public async signIn(payload: WalletProxyResponse): Promise<> {
        try {
            const res = await this.client.AccountsController_signInWithFrequency(null, payload);
            if (res.data.msaId && res.data.publicKey) {
                return {
                    accessToken: await createAuthToken(res.data.publicKey),
                    expires: Date.now() + (24 * 60 * 60 * 1_000),
                }
            }
            return res.data;
        } catch (e) {
            console.error('Failed to forward Sign-in with Frequency request: ', e);
            throw e;
        }
    }
}
