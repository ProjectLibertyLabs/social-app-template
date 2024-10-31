import * as r from '@typoas/runtime';
export type HandleResponse = {
    base_handle: string;
    canonical_base: string;
    suffix: number;
};
export type AccountResponse = {
    msaId: string;
    handle?: HandleResponse;
};
/**
 * Response will contain msaId and controlKey
 */
export type VerifyAuthResponse = {
    /**
     * Message Source Account ID
     */
    msaId?: string;
    /**
     * Control key for polling account status
     */
    controlKey?: string;
    /**
     * Access token for the user
     */
    accessToken?: string;
    /**
     * Expiration time for the access token
     */
    expires?: string;
};
export type VerifyAuthRequest = any | any;
export type FrequencyAccessAuthResponse = {
    /**
     * Base64 encoded signed request containing authentication details
     */
    signedRequest: string;
    /**
     * WebSocket URL for Frequency RPC connection
     */
    frequencyRpcUrl: string;
    /**
     * URL to redirect the user for authentication
     */
    redirectUrl: string;
};
/**
 * Schema defining the request payload for uploading assets. Requires a list of files to upload.
 */
export type UploadAssetRequest = {
    /**
     * Array of files to be uploaded. Each file must be encoded in binary format.
     */
    files: string[];
};
/**
 * Schema defining the response for a successful asset upload operation. Contains identifiers for all uploaded assets.
 */
export type UploadAssetResponse = {
    /**
     * Array of unique identifiers assigned to the uploaded assets.
     */
    assetIds: string[];
};
export type ProviderResponse = {
    nodeUrl: string;
    siwfUrl: string;
    /**
     * IPFS Path Style Gateway base URI
     */
    ipfsGateway?: string;
    providerId: string;
    schemas: number[];
    network: 'local' | 'testnet' | 'mainnet';
};
export type LoginRequest = {
    algo: 'SR25519';
    encoding: 'hex';
    encodedValue: string;
    publicKey: string;
};
export type WalletLoginResponse = {
    referenceId: string;
    msaId?: string;
    handle?: {
        base_handle: string;
        canonical_base: string;
        suffix: number;
    };
};
export type WalletLoginRequest = {
    signIn?: {
        siwsPayload?: {
            message: string;
            signature: string;
        };
        error?: {
            message: string;
        };
    };
    signUp?: {
        extrinsics?: {
            pallet: string;
            extrinsicName: string;
            encodedExtrinsic: string;
        }[];
        error?: {
            message: string;
        };
    };
};
export type LoginResponse = {
    accessToken: string;
    expires: number;
    msaId: string;
};
export type CreateIdentityRequest = {
    addProviderSignature: string;
    algo: 'SR25519';
    baseHandle: string;
    encoding: 'hex';
    expiration: number;
    handleSignature: string;
    publicKey: string;
};
export type CreateIdentityResponse = {
    accessToken: string;
    expires: number;
};
export type AuthAccountResponse = {
    accessToken: string;
    expires: number;
    referenceId?: string;
    msaId: string;
    handle?: {
        base_handle: string;
        canonical_base: string;
        suffix: number;
    };
};
export type DelegateRequest = {
    algo: 'SR25519';
    encoding: 'hex';
    encodedValue: string;
    publicKey: string;
};
export type DelegateResponse = {
    accessToken: string;
    expires: number;
};
export type HandlesResponse = {
    publicKey: string;
    handle: {
        base_handle: string;
        canonical_base: string;
        suffix: number;
    };
};
export type PaginatedBroadcast = {
    newestBlockNumber: number;
    oldestBlockNumber: number;
    posts: BroadcastExtended[];
};
export type Broadcast = {
    fromId: string;
    /**
     * JSON-encoded Activity Content Note
     */
    content: string;
    /**
     * Timestamp of the post
     */
    timestamp: string;
    /**
     * Array of ReplyExtended objects
     */
    replies?: ReplyExtended[];
};
export type PostBroadcastResponse = {
    /**
     * JSON-encoded Activity Content Note
     */
    content: string;
    /**
     * Timestamp of the post
     */
    published: string;
};
export type BroadcastExtended = {
    fromId: string;
    contentHash: string;
    /**
     * JSON-encoded Activity Content Note
     */
    content: string;
    /**
     * Timestamp of the post
     */
    timestamp: string;
    /**
     * Array of ReplyExtended objects
     */
    replies?: ReplyExtended[];
};
export type ReplyExtended = {
    fromId: string;
    contentHash: string;
    /**
     * JSON-encoded Activity Content Note
     */
    content: string;
    /**
     * Timestamp of the post
     */
    timestamp: string;
    /**
     * Array of ReplyExtended objects
     */
    replies?: ReplyExtended[];
};
export type PostBroadcastRequest = {
    content: string;
    inReplyTo?: string;
    assets?: string[];
};
export type CreatePostRequest = {
    content: string;
    inReplyTo?: string;
    images?: string[];
};
export type EditPostRequest = {
    targetContentHash: string;
    targetAnnouncementType: number;
    content: string;
};
export type Profile = {
    fromId: string;
    contentHash: string;
    /**
     * JSON-encoded Activity Content Note
     */
    content: string;
    /**
     * Timestamp of the post
     */
    timestamp: string;
    handle?: {
        base_handle: string;
        canonical_base: string;
        suffix: number;
    };
};
export type EditProfileRequest = {
    content: string;
};
export type AuthMethods = {
    tokenAuth?: r.HttpBearerSecurityAuthentication;
};
export function configureAuth(params?: r.CreateContextParams<AuthMethods>["authProviders"]): AuthMethods {
    return { tokenAuth: params?.tokenAuth && new r.HttpBearerSecurityAuthentication(params.tokenAuth) };
}
export function createContext<FetcherData>(params?: r.CreateContextParams<AuthMethods, FetcherData>): r.Context<AuthMethods, FetcherData> { return new r.Context<AuthMethods, FetcherData>({
    serverConfiguration: new r.ServerConfiguration('http://localhost:3001', {}),
    authMethods: configureAuth(params?.authProviders),
    ...params
}); }
/**
 * Upload and register new assets
 * Allows clients to upload new assets. This endpoint accepts multipart file uploads and returns the identifiers for the
 * newly uploaded assets.
 */
export async function postAssetsHandler<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, body: any, opts?: FetcherData): Promise<UploadAssetResponse> {
    const req = await ctx.createRequest({
        path: '/assets',
        params,
        method: r.HttpMethod.POST,
        body
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Create a new post
 */
export async function postBroadcastHandler<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, body: PostBroadcastRequest, opts?: FetcherData): Promise<PostBroadcastResponse> {
    const req = await ctx.createRequest({
        path: '/broadcasts',
        params,
        method: r.HttpMethod.POST,
        body,
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Return the delegation and provider information
 */
export async function authProvider<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, opts?: FetcherData): Promise<ProviderResponse> {
    const req = await ctx.createRequest({
        path: '/auth/siwf',
        params,
        method: r.HttpMethod.GET
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Verify authorization code
 * Verifies the authorization code received from Frequency
 */
export async function verifyFrequencyAccessAuth<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, body: VerifyAuthRequest, opts?: FetcherData): Promise<VerifyAuthResponse> {
    const req = await ctx.createRequest({
        path: '/auth/login/v2/siwf/verify',
        params,
        method: r.HttpMethod.POST,
        body
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Fetch an account given an Account Id
 * Tags: v1/accounts
 */
export async function getAccountForAccountId<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    accountId: string;
}, opts?: FetcherData): Promise<AccountResponse> {
    const req = await ctx.createRequest({
        path: '/v1/accounts/account/{accountId}',
        params,
        method: r.HttpMethod.GET
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Initiates the authentication process with Frequency-Access and returns necessary credentials and redirect URL
 */
export async function authLoginV2SiwfGet<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, opts?: FetcherData): Promise<FrequencyAccessAuthResponse> {
    const req = await ctx.createRequest({
        path: '/auth/login/v2/siwf',
        params,
        method: r.HttpMethod.GET
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Use Sign In With Frequency to login
 */
export async function authLogin<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, body: WalletLoginRequest, opts?: FetcherData): Promise<WalletLoginResponse | any> {
    const req = await ctx.createRequest({
        path: '/auth/login',
        params,
        method: r.HttpMethod.POST,
        body
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Logout and invalidate the access token
 */
export async function authLogout<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, opts?: FetcherData): Promise<any> {
    const req = await ctx.createRequest({
        path: '/auth/logout',
        params,
        method: r.HttpMethod.POST,
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * For polling to get the created account as authCreate can take time
 */
export async function authAccount<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    accountId?: string;
    msaId?: string;
    referenceId?: string;
}, opts?: FetcherData): Promise<AuthAccountResponse | any> {
    const req = await ctx.createRequest({
        path: '/auth/account',
        params,
        method: r.HttpMethod.GET,
        queryParams: [
            "accountId",
            "msaId",
            "referenceId"
        ]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get recent posts from a user, paginated
 */
export async function getUserFeed<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    dsnpId: string;
    newestBlockNumber?: number;
    oldestBlockNumber?: number;
}, opts?: FetcherData): Promise<PaginatedBroadcast> {
    const req = await ctx.createRequest({
        path: '/content/{dsnpId}',
        params,
        method: r.HttpMethod.GET,
        queryParams: [
            "newestBlockNumber",
            "oldestBlockNumber"
        ],
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get the Feed for the current user, paginated
 */
export async function getFeed<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    newestBlockNumber?: number;
    oldestBlockNumber?: number;
}, opts?: FetcherData): Promise<PaginatedBroadcast> {
    const req = await ctx.createRequest({
        path: '/content/feed',
        params,
        method: r.HttpMethod.GET,
        queryParams: [
            "newestBlockNumber",
            "oldestBlockNumber"
        ],
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get the Discovery Feed, paginated
 */
export async function getDiscover<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    newestBlockNumber?: number;
    oldestBlockNumber?: number;
}, opts?: FetcherData): Promise<PaginatedBroadcast> {
    const req = await ctx.createRequest({
        path: '/content/discover',
        params,
        method: r.HttpMethod.GET,
        queryParams: [
            "newestBlockNumber",
            "oldestBlockNumber"
        ]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Create a new post
 */
export async function createBroadcast<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {}, body: any, opts?: FetcherData): Promise<BroadcastExtended> {
    const req = await ctx.createRequest({
        path: '/content/create',
        params,
        method: r.HttpMethod.POST,
        body,
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get details of a specific post
 */
export async function getContent<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    dsnpId: string;
    contentHash: string;
}, opts?: FetcherData): Promise<BroadcastExtended> {
    const req = await ctx.createRequest({
        path: '/content/{dsnpId}/{contentHash}',
        params,
        method: r.HttpMethod.GET,
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Edit the content of a specific post
 */
export async function editContent<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    contentHash: string;
    type: string;
}, body: EditPostRequest, opts?: FetcherData): Promise<BroadcastExtended> {
    const req = await ctx.createRequest({
        path: '/content/{type}/{contentHash}',
        params,
        method: r.HttpMethod.PUT,
        body,
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get a list of users that a specific user follows
 */
export async function userFollowing<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    msaId: string;
}, opts?: FetcherData): Promise<string[]> {
    const req = await ctx.createRequest({
        path: '/graph/{msaId}/following',
        params,
        method: r.HttpMethod.GET,
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get the status of a previously submitted graph operation by its referenceId
 */
export async function graphOperationStatus<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    referenceId: string;
}, opts?: FetcherData): Promise<{
    /**
     * ReferenceId from the request
     */
    referenceId: string;
    /**
     * status
     */
    status: 'pending' | 'expired' | 'failed' | 'succeeded';
}> {
    const req = await ctx.createRequest({
        path: '/graph/operations/{referenceId}',
        params,
        method: r.HttpMethod.GET,
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Follow a user
 */
export async function graphFollow<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    msaId: string;
}, opts?: FetcherData): Promise<{
    /**
     * ReferenceId from the request
     */
    referenceId?: string;
}> {
    const req = await ctx.createRequest({
        path: '/graph/{msaId}/follow',
        params,
        method: r.HttpMethod.POST,
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Unfollow a user
 */
export async function graphUnfollow<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    msaId: string;
}, opts?: FetcherData): Promise<{
    /**
     * ReferenceId from the request
     */
    referenceId?: string;
}> {
    const req = await ctx.createRequest({
        path: '/graph/{msaId}/unfollow',
        params,
        method: r.HttpMethod.POST,
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Get profile information for a specific user
 */
export async function getProfile<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    msaId: string;
}, opts?: FetcherData): Promise<Profile> {
    const req = await ctx.createRequest({
        path: '/profiles/{msaId}',
        params,
        method: r.HttpMethod.GET,
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
/**
 * Create/Edit the profile information for a current user
 */
export async function createProfile<FetcherData>(ctx: r.Context<AuthMethods, FetcherData>, params: {
    dsnpId: string;
}, body: EditProfileRequest, opts?: FetcherData): Promise<Profile> {
    const req = await ctx.createRequest({
        path: '/profiles/{msaId}',
        params,
        method: r.HttpMethod.PUT,
        body,
        auth: ["tokenAuth"]
    });
    const res = await ctx.sendRequest(req, opts);
    return ctx.handleResponse(res, {});
}
