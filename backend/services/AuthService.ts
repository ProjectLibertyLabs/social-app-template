import { Client } from '../types/openapi-account-service';
import { OpenAPIClientAxios, type Document } from 'openapi-client-axios';
import openapiJson from '../openapi-specs/account-service.json' assert { type: 'json' };
import { WalletProxyResponse, validateSignin, validateSignup } from '@amplica-labs/siwf';
import { createAuthToken, getAuthToken, revokeAuthToken } from './TokenAuth';
import { getApi, getNonce, getProviderKey } from './frequency';
import * as Config from '../config/config';
import axios, { HttpStatusCode } from 'axios';
import { HttpError } from '../types/HttpError';
import { Request } from 'express';


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

    public async signIn(payload: WalletProxyResponse): Promise<any> {
        const api = await getApi();
        const { signIn, signUp } = payload;

        if (signUp) {
            try {
                const { calls, publicKey } = await validateSignup(api, signUp, Config.instance().providerId);

                const txns = calls?.map((tx) => api.tx(tx.encodedExtrinsic));
                const callVec = api.registry.createType('Vec<Call>', txns);

                await api.tx.frequencyTxPayment
                .payWithCapacityBatchAll(callVec)
                .signAndSend(
                    getProviderKey(),
                    { nonce: await getNonce() },
                    ({ status, dispatchError }) => {
                        if (dispatchError) {
                            console.error('ERROR in signup: ', dispatchError.toHuman());
                        } else if (status.isInBlock || status.isFinalized) {
                            console.log('Account signup processed', status.toHuman());
                        }
                    }
                );
                return {
                    accessToken: createAuthToken(publicKey),
                    expires: Date.now() + (24 * 60 * 60 * 1_000),
                }
            } catch (e: any) {
                console.error('Failed signup validation', e);
                throw new HttpError(HttpStatusCode.Unauthorized, 'Failed signup validation', { cause: e });
            }
        } else if (signIn) {
            try {
                const parsedSignin = await validateSignin(api, signIn, 'amplicalabs.github.io');
                return {
                    accessToken: createAuthToken(parsedSignin.publicKey),
                    expires: Date.now() + (24 * 60 * 60 * 1_000),
                }
            } catch (e) {
                console.error('Failed signin: ', e);
                throw new HttpError(HttpStatusCode.Unauthorized, 'Failed signin', { cause: e });
            }
        }

        // Shouldn't get here
        throw new HttpError(HttpStatusCode.BadRequest, 'Invalid signin payload');
    }

    public async getAccount(req: Request) {
        const msaId = req.headers?.['msaId'];

        if (!msaId) {
            return {}
        }

        // REMOVE: This is just for debugging
        console.log(`get the account for msaId: ${msaId}`);
        const handleResp = await axios.get(`${Config.instance().accountServiceUrl}/accounts/${msaId}`);
        // Handle still being created...
        // TODO: Be OK with no handle
        if (handleResp.data === null) {
            return {};
        }

        const handle = handleResp.data.handle;
        // REMOVE: This is just for debugging
        console.log(`handle: ${handle}`);

        return {
            displayHandle: handle,
            dsnpId: msaId?.toString(),
        }
    }

    public logout(req: Request) {
        const authToken = getAuthToken(req);
        if (authToken) {
            revokeAuthToken(authToken);
        }
    }
}
