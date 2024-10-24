import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Components {
  namespace Schemas {
    export interface AccountResponseDto {
      msaId: string;
      handle?: HandleResponseDto;
    }
    export interface AddNewPublicKeyAgreementPayloadRequest {
      payload: ItemizedSignaturePayloadDto;
      /**
       * Raw encodedPayload to be signed
       * example:
       * 0x1234
       */
      encodedPayload: string;
    }
    export interface AddNewPublicKeyAgreementRequestDto {
      /**
       * AccountId in hex or SS58 format
       * example:
       * 1LSLqpLWXo7A7xuiRdu6AQPnBPNJHoQSu8DBsUYJgsNEJ4N
       */
      accountId: string;
      payload: ItemizedSignaturePayloadDto;
      /**
       * proof is the signature for the payload
       * example:
       * 0x065d733ca151c9e65b78f2ba77348224d31647e6913c44ad2765c6e8ba06f834dc21d8182447d01c30f84a41d90a8f2e58001d825c6f0d61b0afe89f984eec85
       */
      proof: string;
    }
    export interface ChangeHandlePayloadRequest {
      payload: HandlePayloadDto;
      /**
       * Raw encodedPayload is scale encoded of payload in hex format
       * example:
       * 0x012345
       */
      encodedPayload: string;
    }
    export interface Delegation {
      providerId: string;
      schemaDelegations: SchemaDelegation[];
      revokedAtBlock?: number;
    }
    export interface DelegationResponse {
      providerId: string;
      schemaPermissions: {
        [key: string]: any;
      };
      revokedAt: U32;
    }
    export interface DelegationResponseV2 {
      msaId: string;
      delegations: Delegation[];
    }
    export interface EncodedExtrinsicDto {
      pallet: string;
      extrinsicName: string;
      /**
       * Hex-encoded representation of the extrinsic
       * example:
       * 0x00112233
       */
      encodedExtrinsic: string;
    }
    export interface ErrorResponseDto {
      /**
       * Error message
       * example:
       * Some error
       */
      message: string;
    }
    export interface GraphKeySubject {
      /**
       * The id type of the VerifiedGraphKeyCredential.
       * example:
       * did:key:z6QNucQV4AF1XMQV4kngbmnBHwYa6mVswPEGrkFrUayhttT1
       */
      id: string;
      /**
       * The encoded public key.
       * example:
       * 0xb5032900293f1c9e5822fd9c120b253cb4a4dfe94c214e688e01f32db9eedf17
       */
      encodedPublicKeyValue: string;
      /**
       * The encoded private key. WARNING: This is sensitive user information!
       * example:
       * 0xd0910c853563723253c4ed105c08614fc8aaaf1b0871375520d72251496e8d87
       */
      encodedPrivateKeyValue: string;
      /**
       * How the encoded keys are encoded. Only "base16" (aka hex) currently.
       * example:
       * base16
       */
      encoding: string;
      /**
       * Any addition formatting options. Only: "bare" currently.
       * example:
       * bare
       */
      format: string;
      /**
       * The encryption key algorithm.
       * example:
       * X25519
       */
      type: string;
      /**
       * The DSNP key type.
       * example:
       * dsnp.public-key-key-agreement
       */
      keyType: string;
    }
    export interface HandlePayloadDto {
      /**
       * base handle in the request
       * example:
       * handle
       */
      baseHandle: string;
      /**
       * expiration block number for this payload
       * example:
       * 1
       */
      expiration: number;
    }
    export interface HandleRequestDto {
      /**
       * AccountId in hex or SS58 format
       * example:
       * 1LSLqpLWXo7A7xuiRdu6AQPnBPNJHoQSu8DBsUYJgsNEJ4N
       */
      accountId: string;
      payload: HandlePayloadDto;
      /**
       * proof is the signature for the payload
       * example:
       * 0x065d733ca151c9e65b78f2ba77348224d31647e6913c44ad2765c6e8ba06f834dc21d8182447d01c30f84a41d90a8f2e58001d825c6f0d61b0afe89f984eec85
       */
      proof: string;
    }
    export interface HandleResponseDto {
      base_handle: string;
      canonical_base: string;
      suffix: number;
    }
    export interface ItemActionDto {
      /**
       * example:
       * ADD_ITEM
       */
      type: /* Action Item type */ ItemActionType;
      /**
       * encodedPayload to be added
       * example:
       * 0x1234
       */
      encodedPayload?: string;
      /**
       * index of the item to be deleted
       * example:
       * 0
       */
      index?: number;
    }
    /**
     * Action Item type
     */
    export type ItemActionType = 'ADD_ITEM' | 'DELETE_ITEM';
    export interface ItemizedSignaturePayloadDto {
      /**
       * example:
       * [
       *   {
       *     "type": "ADD_ITEM",
       *     "encodedPayload": "0x1122"
       *   }
       * ]
       */
      actions: ItemActionDto[];
      /**
       * schemaId related to the payload
       * example:
       * 1
       */
      schemaId: number;
      /**
       * targetHash related to the stateful storage
       * example:
       * 1234
       */
      targetHash: number;
      /**
       * expiration block number for this payload
       * example:
       * 1
       */
      expiration: number;
    }
    export interface KeysRequestDto {
      /**
       * msaOwnerAddress representing the target of this request
       * example:
       * 1LSLqpLWXo7A7xuiRdu6AQPnBPNJHoQSu8DBsUYJgsNEJ4N
       */
      msaOwnerAddress: string;
      /**
       * msaOwnerSignature is the signature by msa owner
       * example:
       * 0x065d733ca151c9e65b78f2ba77348224d31647e6913c44ad2765c6e8ba06f834dc21d8182447d01c30f84a41d90a8f2e58001d825c6f0d61b0afe89f984eec85
       */
      msaOwnerSignature: string;
      /**
       * newKeyOwnerSignature is the signature with new key
       * example:
       * 0x065d733ca151c9e65b78f2ba77348224d31647e6913c44ad2765c6e8ba06f834dc21d8182447d01c30f84a41d90a8f2e58001d825c6f0d61b0afe89f984eec85
       */
      newKeyOwnerSignature: string;
      payload: KeysRequestPayloadDto;
    }
    export interface KeysRequestPayloadDto {
      /**
       * MSA Id of the user requesting the new key
       * example:
       * 3
       */
      msaId: string;
      /**
       * expiration block number for this payload
       * example:
       * 1
       */
      expiration: number;
      /**
       * newPublicKey in hex format
       * example:
       * 0x0ed2f8c714efcac51ca2325cfe95637e5e0b898ae397aa365978b7348a717d0b
       */
      newPublicKey: string;
    }
    export interface KeysResponse {
      msaKeys: {
        [key: string]: any;
      };
    }
    export interface RetireMsaPayloadResponseDto {
      /**
       * Hex-encoded representation of the "RetireMsa" extrinsic
       * example:
       * 0x1234
       */
      encodedExtrinsic: string;
      /**
       * payload to be signed
       * example:
       * 0x1234
       */
      payloadToSign: string;
      /**
       * AccountId in hex or SS58 format
       * example:
       * 1LSLqpLWXo7A7xuiRdu6AQPnBPNJHoQSu8DBsUYJgsNEJ4N
       */
      accountId: string;
    }
    export interface RetireMsaRequestDto {
      /**
       * Hex-encoded representation of the "RetireMsa" extrinsic
       * example:
       * 0x1234
       */
      encodedExtrinsic: string;
      /**
       * payload to be signed
       * example:
       * 0x1234
       */
      payloadToSign: string;
      /**
       * AccountId in hex or SS58 format
       * example:
       * 1LSLqpLWXo7A7xuiRdu6AQPnBPNJHoQSu8DBsUYJgsNEJ4N
       */
      accountId: string;
      /**
       * signature of the owner
       * example:
       * 0x01065d733ca151c9e65b78f2ba77348224d31647e6913c44ad2765c6e8ba06f834dc21d8182447d01c30f84a41d90a8f2e58001d825c6f0d61b0afe89f984eec85
       */
      signature: string;
    }
    export interface RevokeDelegationPayloadRequestDto {
      /**
       * AccountId in hex or SS58 format
       * example:
       * 1LSLqpLWXo7A7xuiRdu6AQPnBPNJHoQSu8DBsUYJgsNEJ4N
       */
      accountId: string;
      /**
       * MSA Id of the provider to whom the requesting user wishes to delegate
       * example:
       * 3
       */
      providerId: string;
      /**
       * Hex-encoded representation of the "revokeDelegation" extrinsic
       * example:
       * 0x1234
       */
      encodedExtrinsic: string;
      /**
       * payload to be signed
       * example:
       * 0x1234
       */
      payloadToSign: string;
      /**
       * signature of the owner
       * example:
       * 0x01065d733ca151c9e65b78f2ba77348224d31647e6913c44ad2765c6e8ba06f834dc21d8182447d01c30f84a41d90a8f2e58001d825c6f0d61b0afe89f984eec85
       */
      signature: string;
    }
    export interface RevokeDelegationPayloadResponseDto {
      /**
       * AccountId in hex or SS58 format
       * example:
       * 1LSLqpLWXo7A7xuiRdu6AQPnBPNJHoQSu8DBsUYJgsNEJ4N
       */
      accountId: string;
      /**
       * MSA Id of the provider to whom the requesting user wishes to delegate
       * example:
       * 3
       */
      providerId: string;
      /**
       * Hex-encoded representation of the "revokeDelegation" extrinsic
       * example:
       * 0x1234
       */
      encodedExtrinsic: string;
      /**
       * payload to be signed
       * example:
       * 0x1234
       */
      payloadToSign: string;
    }
    export interface SchemaDelegation {
      schemaId: number;
      revokedAtBlock?: number;
    }
    export interface SignInResponseDto {
      siwsPayload?: SiwsPayloadDto;
      error?: ErrorResponseDto;
    }
    export interface SignUpResponseDto {
      extrinsics?: EncodedExtrinsicDto[];
      error?: ErrorResponseDto;
    }
    export interface SiwsPayloadDto {
      message: string;
      /**
       * Signature of the payload
       * example:
       * 0x64f8dd8846ba72cbb1954761ec4b2e44b886abb4b4ef7455b869355f17b4ce4a601ad26eabc57a682244a97bc9a2001b59469ae76fea105b724e988967d4928d
       */
      signature: string;
    }
    export interface TransactionResponse {
      referenceId: string;
    }
    export interface U32 {}
    export interface WalletLoginConfigResponseDto {
      providerId: string;
      siwfUrl: string;
      frequencyRpcUrl: string;
    }
    export interface WalletLoginRequestDto {
      /**
       * The wallet login request information
       * example:
       * {
       *   "siwsPayload": {
       *     "message": "0x1234567890abcdef",
       *     "signature": "0x64f8dd8846ba72cbb1954761ec4b2e44b886abb4b4ef7455b869355f17b4ce4a601ad26eabc57a682244a97bc9a2001b59469ae76fea105b724e988967d4928d"
       *   },
       *   "err": {
       *     "message": "Error message"
       *   }
       * }
       */
      signIn?: {
        siwsPayload?: SiwsPayloadDto;
        error?: ErrorResponseDto;
      };
      signUp?: SignUpResponseDto;
    }
    export interface WalletLoginResponseDto {
      referenceId: string;
      msaId?: string;
      publicKey?: string;
    }
    export interface WalletV2LoginRequestDto {
      /**
       * The code returned from the SIWF v2 Authentication service that can be exchanged for the payload. Required unless an `authorizationPayload` is provided.
       * example:
       * 680a0a68-6d3b-4d6d-89b7-0b01a6f7e86f
       */
      authorizationCode?: string;
      /**
       * The SIWF v2 Authentication payload as a JSON stringified and base64url encoded value. Required unless an `authorizationCode` is provided.
       * example:
       * ew0KICAidXNlclB1YmxpY0tleSI6IHsNCiAgICAiZW5jb2RlZFZhbHVlIjogIjVIWUhaOGU4a3lMRUJ1RWJzRmEyYndLWWJWU01nYVVoeW1mUlZnSDdDdU00VkNIdiIsDQogICAgImVuY29kaW5nIjogImJhc2U1OCIsDQogICAgImZvcm1hdCI6ICJzczU4IiwNCiAgICAidHlwZSI6ICJTcjI1NTE5Ig0KICB9LA0KICAidXNlcktleXMiOiBbDQogICAgew0KICAgICAgImVuY29kZWRQdWJsaWNLZXlWYWx1ZSI6ICIweGJkODk2ZmQ1NTAxZWVhMjU5ZjQ3OTg0MTVjOWZhNDQ3ZDU4ODIwZDk5YjkyNDA2NzFhNmYzNGYwYmMwM2IwMzAiLA0KICAgICAgImVuY29kZWRQcml2YXRlS2V5VmFsdWUiOiAiMHhmODExNWQzZTUwYzg2MTYzODZmMDY2ZjY1OTdlZmYwYzU3MGQ2N2M3ZTVjZDkzNjU1Njg4NGJjYzk5NDNmNDY0IiwNCiAgICAgICJlbmNvZGluZyI6ICJiYXNlMTYiLA0KICAgICAgImZvcm1hdCI6ICJiYXJlIiwNCiAgICAgICJ0eXBlIjogIlgyNTUxOSIsDQogICAgICAia2V5VHlwZSI6ICJkc25wLnB1YmxpYy1rZXkta2V5LWFncmVlbWVudCINCiAgICB9DQogIF0sDQogICJwYXlsb2FkcyI6IFsNCiAgICB7DQogICAgICAic2lnbmF0dXJlIjogew0KICAgICAgICAiYWxnbyI6ICJTUjI1NTE5IiwNCiAgICAgICAgImVuY29kaW5nIjogImJhc2UxNiIsDQogICAgICAgICJlbmNvZGVkVmFsdWUiOiAiMHgzMmFlYWViZWZmNWU4ZTEzODM3ZTg3YzQ5MWI0Mzc4MTE1MjYxZWU3NTFjYmYzYTc1ZTY5MmJiNzFhMWNmYzU3ZGRkZDhhODliYjZiNTE3ZjBiNGMyOWI0ZmFlOGUyNjQxZjM2MTEwMWNjMzg5ZmU0OTFmNTQ0NTM0ODFkZmU4OSINCiAgICAgIH0sDQogICAgICAiZW5kcG9pbnQiOiB7DQogICAgICAgICJwYWxsZXQiOiAibXNhIiwNCiAgICAgICAgImV4dHJpbnNpYyI6ICJjcmVhdGVTcG9uc29yZWRBY2NvdW50V2l0aERlbGVnYXRpb24iDQogICAgICB9LA0KICAgICAgInR5cGUiOiAiYWRkUHJvdmlkZXIiLA0KICAgICAgInBheWxvYWQiOiB7DQogICAgICAgICJhdXRob3JpemVkTXNhSWQiOiA3MjksDQogICAgICAgICJzY2hlbWFJZHMiOiBbDQogICAgICAgICAgNiwNCiAgICAgICAgICA3LA0KICAgICAgICAgIDgsDQogICAgICAgICAgOSwNCiAgICAgICAgICAxMA0KICAgICAgICBdLA0KICAgICAgICAiZXhwaXJhdGlvbiI6IDE2MDc1MzgNCiAgICAgIH0NCiAgICB9LA0KICAgIHsNCiAgICAgICJzaWduYXR1cmUiOiB7DQogICAgICAgICJhbGdvIjogIlNSMjU1MTkiLA0KICAgICAgICAiZW5jb2RpbmciOiAiYmFzZTE2IiwNCiAgICAgICAgImVuY29kZWRWYWx1ZSI6ICIweDFhMGI1ZDdkNWNhNzg4Y2VmZDE4NDk3ZDc5NzJkYTk5YzQ3NmI3NTA0YzY5MzNiYzUyYTZkZTA2NWI5NGE3NTFmMzI5Mjg5N2QzMjEzODllOTAwZmQ1MmJmMzEyYzJiZGM3ODAwZWMwMzM2YmJmMTcyY2I3ZTE5ZjU1MjJlODg0Ig0KICAgICAgfSwNCiAgICAgICJlbmRwb2ludCI6IHsNCiAgICAgICAgInBhbGxldCI6ICJoYW5kbGVzIiwNCiAgICAgICAgImV4dHJpbnNpYyI6ICJjbGFpbUhhbmRsZSINCiAgICAgIH0sDQogICAgICAidHlwZSI6ICJjbGFpbUhhbmRsZSIsDQogICAgICAicGF5bG9hZCI6IHsNCiAgICAgICAgImJhc2VIYW5kbGUiOiAid2lsd2FkZSIsDQogICAgICAgICJleHBpcmF0aW9uIjogMTYwNzUzOA0KICAgICAgfQ0KICAgIH0sDQogICAgew0KICAgICAgInNpZ25hdHVyZSI6IHsNCiAgICAgICAgImFsZ28iOiAiU1IyNTUxOSIsDQogICAgICAgICJlbmNvZGluZyI6ICJiYXNlMTYiLA0KICAgICAgICAiZW5jb2RlZFZhbHVlIjogIjB4YTYxN2FhMzEzMDQzMjY1NWY2MjU1ZWQ5NTE5MGE0N2MzMTc1NTk2ZDIwODlkMmE0OGY0M2QyNTdhYWM5NzY0YWZmMmU5NDNmMmNmZThlOGEwMzBmN2RkNzMwODE5NTMyMTVkNzU2YTBiYmU5OGY3MjQ5OWIwMjk3YWY5ZmQ3ODIiDQogICAgICB9LA0KICAgICAgImVuZHBvaW50Ijogew0KICAgICAgICAicGFsbGV0IjogInN0YXRlZnVsU3RvcmFnZSIsDQogICAgICAgICJleHRyaW5zaWMiOiAiYXBwbHlJdGVtQWN0aW9uc1dpdGhTaWduYXR1cmVWMiINCiAgICAgIH0sDQogICAgICAidHlwZSI6ICJpdGVtQWN0aW9ucyIsDQogICAgICAicGF5bG9hZCI6IHsNCiAgICAgICAgInNjaGVtYUlkIjogNywNCiAgICAgICAgInRhcmdldEhhc2giOiAwLA0KICAgICAgICAiZXhwaXJhdGlvbiI6IDE2MDc1MzgsDQogICAgICAgICJhY3Rpb25zIjogWw0KICAgICAgICAgIHsNCiAgICAgICAgICAgICJ0eXBlIjogImFkZEl0ZW0iLA0KICAgICAgICAgICAgInBheWxvYWRIZXgiOiAiMHhiZDg5NmZkNTUwMWVlYTI1OWY0Nzk4NDE1YzlmYTQ0N2Q1ODgyMGQ5OWI5MjQwNjcxYTZmMzRmMGJjMDNiMDMwIg0KICAgICAgICAgIH0NCiAgICAgICAgXQ0KICAgICAgfQ0KICAgIH0NCiAgXSwNCiAgImNyZWRlbnRpYWxzIjogWw0KICAgIHsNCiAgICAgICJAY29udGV4dCI6IFsNCiAgICAgICAgImh0dHBzOi8vd3d3LnczLm9yZy9ucy9jcmVkZW50aWFscy92MiIsDQogICAgICAgICJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvdW5kZWZpbmVkLXRlcm1zL3YyIg0KICAgICAgXSwNCiAgICAgICJ0eXBlIjogWw0KICAgICAgICAiVmVyaWZpZWRFbWFpbEFkZHJlc3NDcmVkZW50aWFsIiwNCiAgICAgICAgIlZlcmlmaWFibGVDcmVkZW50aWFsIg0KICAgICAgXSwNCiAgICAgICJpc3N1ZXIiOiAiZGlkOndlYjp0ZXN0bmV0LmZyZXF1ZW5jeWFjY2Vzcy5jb20iLA0KICAgICAgInZhbGlkRnJvbSI6ICIyMDI0LTEwLTEwVDEyOjUyOjIyLjgzNyswMDAwIiwNCiAgICAgICJjcmVkZW50aWFsU2NoZW1hIjogew0KICAgICAgICAidHlwZSI6ICJKc29uU2NoZW1hIiwNCiAgICAgICAgImlkIjogImh0dHBzOi8vc2NoZW1hcy5mcmVxdWVuY3lhY2Nlc3MuY29tL1ZlcmlmaWVkRW1haWxBZGRyZXNzQ3JlZGVudGlhbC9iY2lxZTRxb2N6aGZ0aWNpNGR6ZnZmYmVsN2ZvNGg0c3I1Z3JjbzNvb3Z3eWs2eTR5bmY0NHRzaS5qc29uIg0KICAgICAgfSwNCiAgICAgICJjcmVkZW50aWFsU3ViamVjdCI6IHsNCiAgICAgICAgImlkIjogImRpZDprZXk6ejZRUDJKdlJ1WFo1d1g3N0tLOGRMOG84UWNDVm5IeTg4UnRnM2NzVXcxdFNEcGRnIiwNCiAgICAgICAgImVtYWlsQWRkcmVzcyI6ICJ3aWwud2FkZUBwcm9qZWN0bGliZXJ0eS5pbyIsDQogICAgICAgICJsYXN0VmVyaWZpZWQiOiAiMjAyNC0xMC0xMFQxMjo1MTowMi4yODMrMDAwMCINCiAgICAgIH0sDQogICAgICAicHJvb2YiOiB7DQogICAgICAgICJ0eXBlIjogIkRhdGFJbnRlZ3JpdHlQcm9vZiIsDQogICAgICAgICJ2ZXJpZmljYXRpb25NZXRob2QiOiAiZGlkOndlYjp0ZXN0bmV0LmZyZXF1ZW5jeWFjY2Vzcy5jb20jejZNa3c0eVg0YzJaM3NlU1NkblI5c3ZFTjZGdjdVa1U4anJOUE1rTXd0WkNvQVZHIiwNCiAgICAgICAgImNyeXB0b3N1aXRlIjogImVkZHNhLXJkZmMtMjAyMiIsDQogICAgICAgICJwcm9vZlB1cnBvc2UiOiAiYXNzZXJ0aW9uTWV0aG9kIiwNCiAgICAgICAgInByb29mVmFsdWUiOiAiejR2Y0RMdEpoY054dnZXY0F3VWNhMUs4YmFCSmNBa2JTcnBwdEhFVG1TZ0FhYjJkc2RkR0gxSjczTFQzc3czUkRjUzdWTE1HRkN1WWluNTNxVFRtNWM2TVAiDQogICAgICB9DQogICAgfSwNCiAgICB7DQogICAgICAiQGNvbnRleHQiOiBbDQogICAgICAgICJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvdjIiLA0KICAgICAgICAiaHR0cHM6Ly93d3cudzMub3JnL25zL2NyZWRlbnRpYWxzL3VuZGVmaW5lZC10ZXJtcy92MiINCiAgICAgIF0sDQogICAgICAidHlwZSI6IFsNCiAgICAgICAgIlZlcmlmaWVkR3JhcGhLZXlDcmVkZW50aWFsIiwNCiAgICAgICAgIlZlcmlmaWFibGVDcmVkZW50aWFsIg0KICAgICAgXSwNCiAgICAgICJpc3N1ZXIiOiAiZGlkOndlYjp0ZXN0bmV0LmZyZXF1ZW5jeWFjY2Vzcy5jb20iLA0KICAgICAgInZhbGlkRnJvbSI6ICIyMDI0LTEwLTEwVDEyOjUyOjIyLjgzOCswMDAwIiwNCiAgICAgICJjcmVkZW50aWFsU2NoZW1hIjogew0KICAgICAgICAidHlwZSI6ICJKc29uU2NoZW1hIiwNCiAgICAgICAgImlkIjogImh0dHBzOi8vc2NoZW1hcy5mcmVxdWVuY3lhY2Nlc3MuY29tL1ZlcmlmaWVkR3JhcGhLZXlDcmVkZW50aWFsL2JjaXFtZHZteGQ1NHp2ZTVraWZ5Y2dzZHRvYWhzNWVjZjRoYWwydHMzZWV4a2dvY3ljNW9jYTJ5Lmpzb24iDQogICAgICB9LA0KICAgICAgImNyZWRlbnRpYWxTdWJqZWN0Ijogew0KICAgICAgICAiaWQiOiAiZGlkOmtleTp6NlFQMkp2UnVYWjV3WDc3S0s4ZEw4bzhRY0NWbkh5ODhSdGczY3NVdzF0U0RwZGciLA0KICAgICAgICAiZW5jb2RlZFB1YmxpY0tleVZhbHVlIjogIjB4YmQ4OTZmZDU1MDFlZWEyNTlmNDc5ODQxNWM5ZmE0NDdkNTg4MjBkOTliOTI0MDY3MWE2ZjM0ZjBiYzAzYjAzMCIsDQogICAgICAgICJlbmNvZGVkUHJpdmF0ZUtleVZhbHVlIjogIjB4ZjgxMTVkM2U1MGM4NjE2Mzg2ZjA2NmY2NTk3ZWZmMGM1NzBkNjdjN2U1Y2Q5MzY1NTY4ODRiY2M5OTQzZjQ2NCIsDQogICAgICAgICJlbmNvZGluZyI6ICJiYXNlMTYiLA0KICAgICAgICAiZm9ybWF0IjogImJhcmUiLA0KICAgICAgICAidHlwZSI6ICJYMjU1MTkiLA0KICAgICAgICAia2V5VHlwZSI6ICJkc25wLnB1YmxpYy1rZXkta2V5LWFncmVlbWVudCINCiAgICAgIH0sDQogICAgICAicHJvb2YiOiB7DQogICAgICAgICJ0eXBlIjogIkRhdGFJbnRlZ3JpdHlQcm9vZiIsDQogICAgICAgICJ2ZXJpZmljYXRpb25NZXRob2QiOiAiZGlkOndlYjp0ZXN0bmV0LmZyZXF1ZW5jeWFjY2Vzcy5jb20jejZNa3c0eVg0YzJaM3NlU1NkblI5c3ZFTjZGdjdVa1U4anJOUE1rTXd0WkNvQVZHIiwNCiAgICAgICAgImNyeXB0b3N1aXRlIjogImVkZHNhLXJkZmMtMjAyMiIsDQogICAgICAgICJwcm9vZlB1cnBvc2UiOiAiYXNzZXJ0aW9uTWV0aG9kIiwNCiAgICAgICAgInByb29mVmFsdWUiOiAiejI5YWRmdG5lSG5LeHdSOWI3Z3RSanlrTFJlR0VwdU1pWTljS0hWQ0JTejZtWThjd0ZaaUZpQVdaSGV4R3R2Qjh0YmRwZmoyRzQzeFF6dFJ6dFdhd21IRjIiDQogICAgICB9DQogICAgfQ0KICBdDQp9
       */
      authorizationPayload?: string;
    }
    export interface WalletV2LoginResponseDto {
      /**
       * The ss58 encoded MSA Control Key of the login.
       * example:
       * f6cL4wq1HUNx11TcvdABNf9UNXXoyH47mVUwT59tzSFRW8yDH
       */
      controlKey: string;
      /**
       * The user's MSA Id, if one is already created. Will be empty if it is still being processed.
       * example:
       * 314159265358979323846264338
       */
      msaId?: string;
      /**
       * The users's validated email
       * example:
       * user@example.com
       */
      email?: string;
      /**
       * The users's validated SMS/Phone Number
       * example:
       * 555-867-5309
       */
      phoneNumber?: string;
      /**
       * The users's Private Graph encryption key.
       * example:
       * 555-867-5309
       */
      graphKey?: {
        /**
         * The id type of the VerifiedGraphKeyCredential.
         * example:
         * did:key:z6QNucQV4AF1XMQV4kngbmnBHwYa6mVswPEGrkFrUayhttT1
         */
        id: string;
        /**
         * The encoded public key.
         * example:
         * 0xb5032900293f1c9e5822fd9c120b253cb4a4dfe94c214e688e01f32db9eedf17
         */
        encodedPublicKeyValue: string;
        /**
         * The encoded private key. WARNING: This is sensitive user information!
         * example:
         * 0xd0910c853563723253c4ed105c08614fc8aaaf1b0871375520d72251496e8d87
         */
        encodedPrivateKeyValue: string;
        /**
         * How the encoded keys are encoded. Only "base16" (aka hex) currently.
         * example:
         * base16
         */
        encoding: string;
        /**
         * Any addition formatting options. Only: "bare" currently.
         * example:
         * bare
         */
        format: string;
        /**
         * The encryption key algorithm.
         * example:
         * X25519
         */
        type: string;
        /**
         * The DSNP key type.
         * example:
         * dsnp.public-key-key-agreement
         */
        keyType: string;
      };
      /**
       * Raw parsed credentials received.
       * example:
       * [
       *   {
       *     "@context": [
       *       "https://www.w3.org/ns/credentials/v2",
       *       "https://www.w3.org/ns/credentials/undefined-terms/v2"
       *     ],
       *     "type": [
       *       "VerifiedEmailAddressCredential",
       *       "VerifiableCredential"
       *     ],
       *     "issuer": "did:web:frequencyaccess.com",
       *     "validFrom": "2024-08-21T21:28:08.289+0000",
       *     "credentialSchema": {
       *       "type": "JsonSchema",
       *       "id": "https://schemas.frequencyaccess.com/VerifiedEmailAddressCredential/bciqe4qoczhftici4dzfvfbel7fo4h4sr5grco3oovwyk6y4ynf44tsi.json"
       *     },
       *     "credentialSubject": {
       *       "id": "did:key:z6QNucQV4AF1XMQV4kngbmnBHwYa6mVswPEGrkFrUayhttT1",
       *       "emailAddress": "john.doe@example.com",
       *       "lastVerified": "2024-08-21T21:27:59.309+0000"
       *     },
       *     "proof": {
       *       "type": "DataIntegrityProof",
       *       "verificationMethod": "did:web:frequencyaccess.com#z6MkofWExWkUvTZeXb9TmLta5mBT6Qtj58es5Fqg1L5BCWQD",
       *       "cryptosuite": "eddsa-rdfc-2022",
       *       "proofPurpose": "assertionMethod",
       *       "proofValue": "z4jArnPwuwYxLnbBirLanpkcyBpmQwmyn5f3PdTYnxhpy48qpgvHHav6warjizjvtLMg6j3FK3BqbR2nuyT2UTSWC"
       *     }
       *   },
       *   {
       *     "@context": [
       *       "https://www.w3.org/ns/credentials/v2",
       *       "https://www.w3.org/ns/credentials/undefined-terms/v2"
       *     ],
       *     "type": [
       *       "VerifiedGraphKeyCredential",
       *       "VerifiableCredential"
       *     ],
       *     "issuer": "did:key:z6QNucQV4AF1XMQV4kngbmnBHwYa6mVswPEGrkFrUayhttT1",
       *     "validFrom": "2024-08-21T21:28:08.289+0000",
       *     "credentialSchema": {
       *       "type": "JsonSchema",
       *       "id": "https://schemas.frequencyaccess.com/VerifiedGraphKeyCredential/bciqmdvmxd54zve5kifycgsdtoahs5ecf4hal2ts3eexkgocyc5oca2y.json"
       *     },
       *     "credentialSubject": {
       *       "id": "did:key:z6QNucQV4AF1XMQV4kngbmnBHwYa6mVswPEGrkFrUayhttT1",
       *       "encodedPublicKeyValue": "0xb5032900293f1c9e5822fd9c120b253cb4a4dfe94c214e688e01f32db9eedf17",
       *       "encodedPrivateKeyValue": "0xd0910c853563723253c4ed105c08614fc8aaaf1b0871375520d72251496e8d87",
       *       "encoding": "base16",
       *       "format": "bare",
       *       "type": "X25519",
       *       "keyType": "dsnp.public-key-key-agreement"
       *     },
       *     "proof": {
       *       "type": "DataIntegrityProof",
       *       "verificationMethod": "did:key:z6MktZ15TNtrJCW2gDLFjtjmxEdhCadNCaDizWABYfneMqhA",
       *       "cryptosuite": "eddsa-rdfc-2022",
       *       "proofPurpose": "assertionMethod",
       *       "proofValue": "z2HHWwtWggZfvGqNUk4S5AAbDGqZRFXjpMYAsXXmEksGxTk4DnnkN3upCiL1mhgwHNLkxY3s8YqNyYnmpuvUke7jF"
       *     }
       *   }
       * ]
       */
      rawCredentials?: {
        [key: string]: any;
      }[];
    }
    export interface WalletV2RedirectResponseDto {
      /**
       * The base64url encoded JSON stringified signed request
       * example:
       * eyJyZXF1ZXN0ZWRTaWduYXR1cmVzIjp7InB1YmxpY0tleSI6eyJlbmNvZGVkVmFsdWUiOiJmNmNMNHdxMUhVTngxMVRjdmRBQk5mOVVOWFhveUg0N21WVXdUNTl0elNGUlc4eURIIiwiZW5jb2RpbmciOiJiYXNlNTgiLCJmb3JtYXQiOiJzczU4IiwidHlwZSI6IlNyMjU1MTkifSwic2lnbmF0dXJlIjp7ImFsZ28iOiJTcjI1NTE5IiwiZW5jb2RpbmciOiJiYXNlMTYiLCJlbmNvZGVkVmFsdWUiOiIweDA0MDdjZTgxNGI3Nzg2MWRmOTRkMTZiM2ZjYjMxN2QzN2EwN2FiYzJhN2Y5Y2Q3YzAyY2MyMjUyOWVlN2IzMmQ1Njc5NWY4OGJkNmI0YWQxMDZiNzJiOTFiNjI0NmE3ODM2NzFiY2QyNGNiMDFhYWYwZTkzMTZkYjVlMGNkMDg1In0sInBheWxvYWQiOnsiY2FsbGJhY2siOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJwZXJtaXNzaW9ucyI6WzUsNyw4LDksMTBdfX0sInJlcXVlc3RlZENyZWRlbnRpYWxzIjpbeyJ0eXBlIjoiVmVyaWZpZWRHcmFwaEtleUNyZWRlbnRpYWwiLCJoYXNoIjpbImJjaXFtZHZteGQ1NHp2ZTVraWZ5Y2dzZHRvYWhzNWVjZjRoYWwydHMzZWV4a2dvY3ljNW9jYTJ5Il19LHsiYW55T2YiOlt7InR5cGUiOiJWZXJpZmllZEVtYWlsQWRkcmVzc0NyZWRlbnRpYWwiLCJoYXNoIjpbImJjaXFlNHFvY3poZnRpY2k0ZHpmdmZiZWw3Zm80aDRzcjVncmNvM29vdnd5azZ5NHluZjQ0dHNpIl19LHsidHlwZSI6IlZlcmlmaWVkUGhvbmVOdW1iZXJDcmVkZW50aWFsIiwiaGFzaCI6WyJiY2lxanNwbmJ3cGMzd2p4NGZld2NlazVkYXlzZGpwYmY1eGppbXo1d251NXVqN2UzdnUydXducSJdfV19XX0
       */
      signedRequest: string;
      /**
       * A publically available Frequency node for SIWF dApps to connect to the correct chain
       * example:
       * wss://1.rpc.frequency.xyz
       */
      frequencyRpcUrl: string;
      /**
       * The compiled redirect url with all the parameters already built in
       * example:
       * https://testnet.frequencyaccess.com/siwa/start?signedRequest=eyJyZXF1ZXN0ZWRTaWduYXR1cmVzIjp7InB1YmxpY0tleSI6eyJlbmNvZGVkVmFsdWUiOiJmNmNMNHdxMUhVTngxMVRjdmRBQk5mOVVOWFhveUg0N21WVXdUNTl0elNGUlc4eURIIiwiZW5jb2RpbmciOiJiYXNlNTgiLCJmb3JtYXQiOiJzczU4IiwidHlwZSI6IlNyMjU1MTkifSwic2lnbmF0dXJlIjp7ImFsZ28iOiJTcjI1NTE5IiwiZW5jb2RpbmciOiJiYXNlMTYiLCJlbmNvZGVkVmFsdWUiOiIweDA0MDdjZTgxNGI3Nzg2MWRmOTRkMTZiM2ZjYjMxN2QzN2EwN2FiYzJhN2Y5Y2Q3YzAyY2MyMjUyOWVlN2IzMmQ1Njc5NWY4OGJkNmI0YWQxMDZiNzJiOTFiNjI0NmE3ODM2NzFiY2QyNGNiMDFhYWYwZTkzMTZkYjVlMGNkMDg1In0sInBheWxvYWQiOnsiY2FsbGJhY2siOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJwZXJtaXNzaW9ucyI6WzUsNyw4LDksMTBdfX0sInJlcXVlc3RlZENyZWRlbnRpYWxzIjpbeyJ0eXBlIjoiVmVyaWZpZWRHcmFwaEtleUNyZWRlbnRpYWwiLCJoYXNoIjpbImJjaXFtZHZteGQ1NHp2ZTVraWZ5Y2dzZHRvYWhzNWVjZjRoYWwydHMzZWV4a2dvY3ljNW9jYTJ5Il19LHsiYW55T2YiOlt7InR5cGUiOiJWZXJpZmllZEVtYWlsQWRkcmVzc0NyZWRlbnRpYWwiLCJoYXNoIjpbImJjaXFlNHFvY3poZnRpY2k0ZHpmdmZiZWw3Zm80aDRzcjVncmNvM29vdnd5azZ5NHluZjQ0dHNpIl19LHsidHlwZSI6IlZlcmlmaWVkUGhvbmVOdW1iZXJDcmVkZW50aWFsIiwiaGFzaCI6WyJiY2lxanNwbmJ3cGMzd2p4NGZld2NlazVkYXlzZGpwYmY1eGppbXo1d251NXVqN2UzdnUydXducSJdfV19XX0
       */
      redirectUrl: string;
    }
  }
}
declare namespace Paths {
  namespace AccountsControllerV1GetAccountForAccountId {
    namespace Parameters {
      /**
       * example:
       * 1LSLqpLWXo7A7xuiRdu6AQPnBPNJHoQSu8DBsUYJgsNEJ4N
       */
      export type AccountId = string;
    }
    export interface PathParameters {
      accountId: /**
       * example:
       * 1LSLqpLWXo7A7xuiRdu6AQPnBPNJHoQSu8DBsUYJgsNEJ4N
       */
      Parameters.AccountId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.AccountResponseDto;
    }
  }
  namespace AccountsControllerV1GetAccountForMsa {
    namespace Parameters {
      /**
       * example:
       * 2
       */
      export type MsaId = string;
    }
    export interface PathParameters {
      msaId: /**
       * example:
       * 2
       */
      Parameters.MsaId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.AccountResponseDto;
    }
  }
  namespace AccountsControllerV1GetRetireMsaPayload {
    namespace Parameters {
      /**
       * example:
       * 1LSLqpLWXo7A7xuiRdu6AQPnBPNJHoQSu8DBsUYJgsNEJ4N
       */
      export type AccountId = string;
    }
    export interface PathParameters {
      accountId: /**
       * example:
       * 1LSLqpLWXo7A7xuiRdu6AQPnBPNJHoQSu8DBsUYJgsNEJ4N
       */
      Parameters.AccountId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.RetireMsaPayloadResponseDto;
    }
  }
  namespace AccountsControllerV1GetSIWFConfig {
    namespace Responses {
      export type $200 = Components.Schemas.WalletLoginConfigResponseDto;
    }
  }
  namespace AccountsControllerV1PostRetireMsa {
    export type RequestBody = Components.Schemas.RetireMsaRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.TransactionResponse;
    }
  }
  namespace AccountsControllerV1PostSignInWithFrequency {
    export type RequestBody = Components.Schemas.WalletLoginRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.WalletLoginResponseDto;
    }
  }
  namespace AccountsControllerV2GetRedirectUrl {
    namespace Parameters {
      /**
       * example:
       * http://localhost:3000/login/callback
       */
      export type CallbackUrl = string;
      /**
       * example:
       * [
       *   "VerifiedGraphKeyCredential",
       *   "VerifiedEmailAddressCredential",
       *   "VerifiedPhoneNumberCredential"
       * ]
       */
      export type Credentials = string[];
      /**
       * example:
       * [
       *   "dsnp.broadcast@v2",
       *   "dsnp.private-follows@v1",
       *   "dsnp.reply@v2",
       *   "dsnp.reaction@v1",
       *   "dsnp.tombstone@v2",
       *   "dsnp.update@v2",
       *   "frequency.default-token-address@v1"
       * ]
       */
      export type Permissions = string[];
    }
    export interface QueryParameters {
      credentials?: /**
       * example:
       * [
       *   "VerifiedGraphKeyCredential",
       *   "VerifiedEmailAddressCredential",
       *   "VerifiedPhoneNumberCredential"
       * ]
       */
      Parameters.Credentials;
      permissions?: /**
       * example:
       * [
       *   "dsnp.broadcast@v2",
       *   "dsnp.private-follows@v1",
       *   "dsnp.reply@v2",
       *   "dsnp.reaction@v1",
       *   "dsnp.tombstone@v2",
       *   "dsnp.update@v2",
       *   "frequency.default-token-address@v1"
       * ]
       */
      Parameters.Permissions;
      callbackUrl: /**
       * example:
       * http://localhost:3000/login/callback
       */
      Parameters.CallbackUrl;
    }
    namespace Responses {
      export type $200 = Components.Schemas.WalletV2RedirectResponseDto;
    }
  }
  namespace AccountsControllerV2PostSignInWithFrequency {
    export type RequestBody = Components.Schemas.WalletV2LoginRequestDto;
    namespace Responses {
      export type $200 = Components.Schemas.WalletV2LoginResponseDto;
    }
  }
  namespace DelegationControllerV1GetDelegation {
    namespace Parameters {
      /**
       * example:
       * 2
       */
      export type MsaId = string;
    }
    export interface PathParameters {
      msaId: /**
       * example:
       * 2
       */
      Parameters.MsaId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.DelegationResponse;
    }
  }
  namespace DelegationControllerV1GetRevokeDelegationPayload {
    namespace Parameters {
      /**
       * example:
       * 1LSLqpLWXo7A7xuiRdu6AQPnBPNJHoQSu8DBsUYJgsNEJ4N
       */
      export type AccountId = string;
      /**
       * example:
       * 1
       */
      export type ProviderId = string;
    }
    export interface PathParameters {
      accountId: /**
       * example:
       * 1LSLqpLWXo7A7xuiRdu6AQPnBPNJHoQSu8DBsUYJgsNEJ4N
       */
      Parameters.AccountId;
      providerId: /**
       * example:
       * 1
       */
      Parameters.ProviderId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.RevokeDelegationPayloadResponseDto;
    }
  }
  namespace DelegationControllerV1PostRevokeDelegation {
    export type RequestBody = Components.Schemas.RevokeDelegationPayloadRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.TransactionResponse;
    }
  }
  namespace DelegationsControllerV2GetDelegation {
    namespace Parameters {
      /**
       * example:
       * 3
       */
      export type MsaId = string;
    }
    export interface PathParameters {
      msaId: /**
       * example:
       * 3
       */
      Parameters.MsaId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.DelegationResponseV2;
    }
  }
  namespace DelegationsControllerV2GetProviderDelegation {
    namespace Parameters {
      /**
       * example:
       * 3
       */
      export type MsaId = string;
      /**
       * example:
       * 1
       */
      export type ProviderId = string;
    }
    export interface PathParameters {
      msaId: /**
       * example:
       * 3
       */
      Parameters.MsaId;
      providerId?: /**
       * example:
       * 1
       */
      Parameters.ProviderId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.DelegationResponseV2;
    }
  }
  namespace HandlesControllerV1ChangeHandle {
    export type RequestBody = Components.Schemas.HandleRequestDto;
    namespace Responses {
      export type $200 = Components.Schemas.TransactionResponse;
    }
  }
  namespace HandlesControllerV1CreateHandle {
    export type RequestBody = Components.Schemas.HandleRequestDto;
    namespace Responses {
      export type $200 = Components.Schemas.TransactionResponse;
    }
  }
  namespace HandlesControllerV1GetChangeHandlePayload {
    namespace Parameters {
      /**
       * example:
       * handle
       */
      export type NewHandle = string;
    }
    export interface PathParameters {
      newHandle: /**
       * example:
       * handle
       */
      Parameters.NewHandle;
    }
    namespace Responses {
      export type $200 = Components.Schemas.ChangeHandlePayloadRequest;
    }
  }
  namespace HandlesControllerV1GetHandle {
    namespace Parameters {
      /**
       * example:
       * 2
       */
      export type MsaId = string;
    }
    export interface PathParameters {
      msaId: /**
       * example:
       * 2
       */
      Parameters.MsaId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.HandleResponseDto;
    }
  }
  namespace HealthControllerHealthz {
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace HealthControllerLivez {
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace HealthControllerReadyz {
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace KeysControllerV1AddKey {
    export type RequestBody = Components.Schemas.KeysRequestDto;
    namespace Responses {
      export type $200 = Components.Schemas.TransactionResponse;
    }
  }
  namespace KeysControllerV1AddNewPublicKeyAgreements {
    export type RequestBody = Components.Schemas.AddNewPublicKeyAgreementRequestDto;
    namespace Responses {
      export type $200 = Components.Schemas.TransactionResponse;
    }
  }
  namespace KeysControllerV1GetKeys {
    namespace Parameters {
      /**
       * example:
       * 2
       */
      export type MsaId = string;
    }
    export interface PathParameters {
      msaId: /**
       * example:
       * 2
       */
      Parameters.MsaId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.KeysResponse;
    }
  }
  namespace KeysControllerV1GetPublicKeyAgreementsKeyPayload {
    namespace Parameters {
      /**
       * example:
       * 3
       */
      export type MsaId = string;
      /**
       * example:
       * 0x0ed2f8c714efcac51ca2325cfe95637e5e0b898ae397aa365978b7348a717d0b
       */
      export type NewKey = string;
    }
    export interface QueryParameters {
      msaId: /**
       * example:
       * 3
       */
      Parameters.MsaId;
      newKey: /**
       * example:
       * 0x0ed2f8c714efcac51ca2325cfe95637e5e0b898ae397aa365978b7348a717d0b
       */
      Parameters.NewKey;
    }
    namespace Responses {
      export type $200 = Components.Schemas.AddNewPublicKeyAgreementPayloadRequest;
    }
  }
}

export interface OperationMethods {
  /**
   * AccountsControllerV2_getRedirectUrl - Get the Sign In With Frequency Redirect URL
   */
  'AccountsControllerV2_getRedirectUrl'(
    parameters?: Parameters<Paths.AccountsControllerV2GetRedirectUrl.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AccountsControllerV2GetRedirectUrl.Responses.$200>;
  /**
   * AccountsControllerV2_postSignInWithFrequency - Process the result of a Sign In With Frequency v2 callback
   */
  'AccountsControllerV2_postSignInWithFrequency'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AccountsControllerV2PostSignInWithFrequency.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AccountsControllerV2PostSignInWithFrequency.Responses.$200>;
  /**
   * AccountsControllerV1_getSIWFConfig - Get the Sign In With Frequency configuration
   */
  'AccountsControllerV1_getSIWFConfig'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AccountsControllerV1GetSIWFConfig.Responses.$200>;
  /**
   * AccountsControllerV1_postSignInWithFrequency - Request to Sign In With Frequency
   */
  'AccountsControllerV1_postSignInWithFrequency'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AccountsControllerV1PostSignInWithFrequency.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AccountsControllerV1PostSignInWithFrequency.Responses.$201>;
  /**
   * AccountsControllerV1_getAccountForMsa - Fetch an account given an MSA Id
   */
  'AccountsControllerV1_getAccountForMsa'(
    parameters: Parameters<Paths.AccountsControllerV1GetAccountForMsa.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AccountsControllerV1GetAccountForMsa.Responses.$200>;
  /**
   * AccountsControllerV1_getAccountForAccountId - Fetch an account given an Account Id
   */
  'AccountsControllerV1_getAccountForAccountId'(
    parameters: Parameters<Paths.AccountsControllerV1GetAccountForAccountId.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AccountsControllerV1GetAccountForAccountId.Responses.$200>;
  /**
   * AccountsControllerV1_getRetireMsaPayload - Get a retireMsa unsigned, encoded extrinsic payload.
   */
  'AccountsControllerV1_getRetireMsaPayload'(
    parameters: Parameters<Paths.AccountsControllerV1GetRetireMsaPayload.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AccountsControllerV1GetRetireMsaPayload.Responses.$200>;
  /**
   * AccountsControllerV1_postRetireMsa - Request to retire an MSA ID.
   */
  'AccountsControllerV1_postRetireMsa'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AccountsControllerV1PostRetireMsa.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AccountsControllerV1PostRetireMsa.Responses.$201>;
  /**
   * DelegationsControllerV2_getDelegation - Get all delegation information associated with an MSA Id
   */
  'DelegationsControllerV2_getDelegation'(
    parameters: Parameters<Paths.DelegationsControllerV2GetDelegation.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DelegationsControllerV2GetDelegation.Responses.$200>;
  /**
   * DelegationsControllerV2_getProviderDelegation - Get an MSA's delegation information for a specific provider
   */
  'DelegationsControllerV2_getProviderDelegation'(
    parameters: Parameters<Paths.DelegationsControllerV2GetProviderDelegation.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DelegationsControllerV2GetProviderDelegation.Responses.$200>;
  /**
   * DelegationControllerV1_getDelegation - Get the delegation information associated with an MSA Id
   */
  'DelegationControllerV1_getDelegation'(
    parameters: Parameters<Paths.DelegationControllerV1GetDelegation.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DelegationControllerV1GetDelegation.Responses.$200>;
  /**
   * DelegationControllerV1_getRevokeDelegationPayload - Get a properly encoded RevokeDelegationPayload that can be signed
   */
  'DelegationControllerV1_getRevokeDelegationPayload'(
    parameters: Parameters<Paths.DelegationControllerV1GetRevokeDelegationPayload.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DelegationControllerV1GetRevokeDelegationPayload.Responses.$200>;
  /**
   * DelegationControllerV1_postRevokeDelegation - Request to revoke a delegation
   */
  'DelegationControllerV1_postRevokeDelegation'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.DelegationControllerV1PostRevokeDelegation.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DelegationControllerV1PostRevokeDelegation.Responses.$201>;
  /**
   * HandlesControllerV1_createHandle - Request to create a new handle for an account
   */
  'HandlesControllerV1_createHandle'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.HandlesControllerV1CreateHandle.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.HandlesControllerV1CreateHandle.Responses.$200>;
  /**
   * HandlesControllerV1_changeHandle - Request to change a handle
   */
  'HandlesControllerV1_changeHandle'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.HandlesControllerV1ChangeHandle.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.HandlesControllerV1ChangeHandle.Responses.$200>;
  /**
   * HandlesControllerV1_getChangeHandlePayload - Get a properly encoded ClaimHandlePayload that can be signed.
   */
  'HandlesControllerV1_getChangeHandlePayload'(
    parameters: Parameters<Paths.HandlesControllerV1GetChangeHandlePayload.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.HandlesControllerV1GetChangeHandlePayload.Responses.$200>;
  /**
   * HandlesControllerV1_getHandle - Fetch a handle given an MSA Id
   */
  'HandlesControllerV1_getHandle'(
    parameters: Parameters<Paths.HandlesControllerV1GetHandle.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.HandlesControllerV1GetHandle.Responses.$200>;
  /**
   * KeysControllerV1_addKey - Add new control keys for an MSA Id
   */
  'KeysControllerV1_addKey'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.KeysControllerV1AddKey.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.KeysControllerV1AddKey.Responses.$200>;
  /**
   * KeysControllerV1_getKeys - Fetch public keys given an MSA Id
   */
  'KeysControllerV1_getKeys'(
    parameters: Parameters<Paths.KeysControllerV1GetKeys.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.KeysControllerV1GetKeys.Responses.$200>;
  /**
   * KeysControllerV1_getPublicKeyAgreementsKeyPayload - Get a properly encoded StatefulStorageItemizedSignaturePayloadV2 that can be signed.
   */
  'KeysControllerV1_getPublicKeyAgreementsKeyPayload'(
    parameters?: Parameters<Paths.KeysControllerV1GetPublicKeyAgreementsKeyPayload.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.KeysControllerV1GetPublicKeyAgreementsKeyPayload.Responses.$200>;
  /**
   * KeysControllerV1_AddNewPublicKeyAgreements - Request to add a new public Key
   */
  'KeysControllerV1_AddNewPublicKeyAgreements'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.KeysControllerV1AddNewPublicKeyAgreements.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.KeysControllerV1AddNewPublicKeyAgreements.Responses.$200>;
  /**
   * HealthController_healthz - Check the health status of the service
   */
  'HealthController_healthz'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.HealthControllerHealthz.Responses.$200>;
  /**
   * HealthController_livez - Check the live status of the service
   */
  'HealthController_livez'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.HealthControllerLivez.Responses.$200>;
  /**
   * HealthController_readyz - Check the ready status of the service
   */
  'HealthController_readyz'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.HealthControllerReadyz.Responses.$200>;
}

export interface PathsDictionary {
  ['/v2/accounts/siwf']: {
    /**
     * AccountsControllerV2_getRedirectUrl - Get the Sign In With Frequency Redirect URL
     */
    'get'(
      parameters?: Parameters<Paths.AccountsControllerV2GetRedirectUrl.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AccountsControllerV2GetRedirectUrl.Responses.$200>;
    /**
     * AccountsControllerV2_postSignInWithFrequency - Process the result of a Sign In With Frequency v2 callback
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AccountsControllerV2PostSignInWithFrequency.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AccountsControllerV2PostSignInWithFrequency.Responses.$200>;
  };
  ['/v1/accounts/siwf']: {
    /**
     * AccountsControllerV1_getSIWFConfig - Get the Sign In With Frequency configuration
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AccountsControllerV1GetSIWFConfig.Responses.$200>;
    /**
     * AccountsControllerV1_postSignInWithFrequency - Request to Sign In With Frequency
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AccountsControllerV1PostSignInWithFrequency.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AccountsControllerV1PostSignInWithFrequency.Responses.$201>;
  };
  ['/v1/accounts/{msaId}']: {
    /**
     * AccountsControllerV1_getAccountForMsa - Fetch an account given an MSA Id
     */
    'get'(
      parameters: Parameters<Paths.AccountsControllerV1GetAccountForMsa.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AccountsControllerV1GetAccountForMsa.Responses.$200>;
  };
  ['/v1/accounts/account/{accountId}']: {
    /**
     * AccountsControllerV1_getAccountForAccountId - Fetch an account given an Account Id
     */
    'get'(
      parameters: Parameters<Paths.AccountsControllerV1GetAccountForAccountId.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AccountsControllerV1GetAccountForAccountId.Responses.$200>;
  };
  ['/v1/accounts/retireMsa/{accountId}']: {
    /**
     * AccountsControllerV1_getRetireMsaPayload - Get a retireMsa unsigned, encoded extrinsic payload.
     */
    'get'(
      parameters: Parameters<Paths.AccountsControllerV1GetRetireMsaPayload.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AccountsControllerV1GetRetireMsaPayload.Responses.$200>;
  };
  ['/v1/accounts/retireMsa']: {
    /**
     * AccountsControllerV1_postRetireMsa - Request to retire an MSA ID.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AccountsControllerV1PostRetireMsa.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AccountsControllerV1PostRetireMsa.Responses.$201>;
  };
  ['/v2/delegations/{msaId}']: {
    /**
     * DelegationsControllerV2_getDelegation - Get all delegation information associated with an MSA Id
     */
    'get'(
      parameters: Parameters<Paths.DelegationsControllerV2GetDelegation.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DelegationsControllerV2GetDelegation.Responses.$200>;
  };
  ['/v2/delegations/{msaId}/{providerId}']: {
    /**
     * DelegationsControllerV2_getProviderDelegation - Get an MSA's delegation information for a specific provider
     */
    'get'(
      parameters: Parameters<Paths.DelegationsControllerV2GetProviderDelegation.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DelegationsControllerV2GetProviderDelegation.Responses.$200>;
  };
  ['/v1/delegation/{msaId}']: {
    /**
     * DelegationControllerV1_getDelegation - Get the delegation information associated with an MSA Id
     */
    'get'(
      parameters: Parameters<Paths.DelegationControllerV1GetDelegation.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DelegationControllerV1GetDelegation.Responses.$200>;
  };
  ['/v1/delegation/revokeDelegation/{accountId}/{providerId}']: {
    /**
     * DelegationControllerV1_getRevokeDelegationPayload - Get a properly encoded RevokeDelegationPayload that can be signed
     */
    'get'(
      parameters: Parameters<Paths.DelegationControllerV1GetRevokeDelegationPayload.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DelegationControllerV1GetRevokeDelegationPayload.Responses.$200>;
  };
  ['/v1/delegation/revokeDelegation']: {
    /**
     * DelegationControllerV1_postRevokeDelegation - Request to revoke a delegation
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.DelegationControllerV1PostRevokeDelegation.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DelegationControllerV1PostRevokeDelegation.Responses.$201>;
  };
  ['/v1/handles']: {
    /**
     * HandlesControllerV1_createHandle - Request to create a new handle for an account
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.HandlesControllerV1CreateHandle.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.HandlesControllerV1CreateHandle.Responses.$200>;
  };
  ['/v1/handles/change']: {
    /**
     * HandlesControllerV1_changeHandle - Request to change a handle
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.HandlesControllerV1ChangeHandle.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.HandlesControllerV1ChangeHandle.Responses.$200>;
  };
  ['/v1/handles/change/{newHandle}']: {
    /**
     * HandlesControllerV1_getChangeHandlePayload - Get a properly encoded ClaimHandlePayload that can be signed.
     */
    'get'(
      parameters: Parameters<Paths.HandlesControllerV1GetChangeHandlePayload.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.HandlesControllerV1GetChangeHandlePayload.Responses.$200>;
  };
  ['/v1/handles/{msaId}']: {
    /**
     * HandlesControllerV1_getHandle - Fetch a handle given an MSA Id
     */
    'get'(
      parameters: Parameters<Paths.HandlesControllerV1GetHandle.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.HandlesControllerV1GetHandle.Responses.$200>;
  };
  ['/v1/keys/add']: {
    /**
     * KeysControllerV1_addKey - Add new control keys for an MSA Id
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.KeysControllerV1AddKey.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.KeysControllerV1AddKey.Responses.$200>;
  };
  ['/v1/keys/{msaId}']: {
    /**
     * KeysControllerV1_getKeys - Fetch public keys given an MSA Id
     */
    'get'(
      parameters: Parameters<Paths.KeysControllerV1GetKeys.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.KeysControllerV1GetKeys.Responses.$200>;
  };
  ['/v1/keys/publicKeyAgreements/getAddKeyPayload']: {
    /**
     * KeysControllerV1_getPublicKeyAgreementsKeyPayload - Get a properly encoded StatefulStorageItemizedSignaturePayloadV2 that can be signed.
     */
    'get'(
      parameters?: Parameters<Paths.KeysControllerV1GetPublicKeyAgreementsKeyPayload.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.KeysControllerV1GetPublicKeyAgreementsKeyPayload.Responses.$200>;
  };
  ['/v1/keys/publicKeyAgreements']: {
    /**
     * KeysControllerV1_AddNewPublicKeyAgreements - Request to add a new public Key
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.KeysControllerV1AddNewPublicKeyAgreements.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.KeysControllerV1AddNewPublicKeyAgreements.Responses.$200>;
  };
  ['/healthz']: {
    /**
     * HealthController_healthz - Check the health status of the service
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.HealthControllerHealthz.Responses.$200>;
  };
  ['/livez']: {
    /**
     * HealthController_livez - Check the live status of the service
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.HealthControllerLivez.Responses.$200>;
  };
  ['/readyz']: {
    /**
     * HealthController_readyz - Check the ready status of the service
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.HealthControllerReadyz.Responses.$200>;
  };
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>;
