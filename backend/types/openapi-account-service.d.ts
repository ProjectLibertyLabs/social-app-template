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
      revokedAt: {
        [key: string]: any;
      };
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
    export interface ItemizedSignaturePayloadDto {
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
      /**
       * example:
       * [
       *   {
       *     "type": "ADD_ITEM",
       *     "encodedPayload": "0x1122"
       *   }
       * ]
       */
      actions: string[];
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
       * 0x065d733ca151c9e65b78f2ba77348224d31647e6913c44ad2765c6e8ba06f834dc21d8182447d01c30f84a41d90a8f2e58001d825c6f0d61b0afe89f984eec85
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
       * 0x065d733ca151c9e65b78f2ba77348224d31647e6913c44ad2765c6e8ba06f834dc21d8182447d01c30f84a41d90a8f2e58001d825c6f0d61b0afe89f984eec85
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
  }
}
declare namespace Paths {
  namespace AccountsControllerV1GetAccountForAccountId {
    namespace Parameters {
      export type AccountId = string;
    }
    export interface PathParameters {
      accountId: Parameters.AccountId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.AccountResponseDto;
    }
  }
  namespace AccountsControllerV1GetAccountForMsa {
    namespace Parameters {
      export type MsaId = string;
    }
    export interface PathParameters {
      msaId: Parameters.MsaId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.AccountResponseDto;
    }
  }
  namespace AccountsControllerV1GetRetireMsaPayload {
    namespace Parameters {
      export type AccountId = string;
    }
    export interface PathParameters {
      accountId: Parameters.AccountId;
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
  namespace DelegationControllerV1GetDelegation {
    namespace Parameters {
      export type MsaId = string;
    }
    export interface PathParameters {
      msaId: Parameters.MsaId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.DelegationResponse;
    }
  }
  namespace DelegationControllerV1GetRevokeDelegationPayload {
    namespace Parameters {
      export type AccountId = string;
      export type ProviderId = string;
    }
    export interface PathParameters {
      accountId: Parameters.AccountId;
      providerId: Parameters.ProviderId;
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
      export type MsaId = string;
    }
    export interface PathParameters {
      msaId: Parameters.MsaId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.DelegationResponseV2;
    }
  }
  namespace DelegationsControllerV2GetProviderDelegation {
    namespace Parameters {
      export type MsaId = string;
      export type ProviderId = string;
    }
    export interface PathParameters {
      msaId: Parameters.MsaId;
      providerId?: Parameters.ProviderId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.DelegationResponseV2;
    }
  }
  namespace HandlesControllerV1ChangeHandle {
    export type RequestBody = Components.Schemas.HandleRequestDto;
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace HandlesControllerV1CreateHandle {
    export type RequestBody = Components.Schemas.HandleRequestDto;
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace HandlesControllerV1GetChangeHandlePayload {
    namespace Parameters {
      export type NewHandle = string;
    }
    export interface PathParameters {
      newHandle: Parameters.NewHandle;
    }
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace HandlesControllerV1GetHandle {
    namespace Parameters {
      export type MsaId = string;
    }
    export interface PathParameters {
      msaId: Parameters.MsaId;
    }
    namespace Responses {
      export interface $200 {}
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
      export interface $200 {}
    }
  }
  namespace KeysControllerV1AddNewPublicKeyAgreements {
    export type RequestBody = Components.Schemas.AddNewPublicKeyAgreementRequestDto;
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace KeysControllerV1GetKeys {
    namespace Parameters {
      export type MsaId = string;
    }
    export interface PathParameters {
      msaId: Parameters.MsaId;
    }
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace KeysControllerV1GetPublicKeyAgreementsKeyPayload {
    namespace Parameters {
      export type MsaId = string;
      export type NewKey = string;
    }
    export interface QueryParameters {
      msaId: Parameters.MsaId;
      newKey: Parameters.NewKey;
    }
    namespace Responses {
      export interface $200 {}
    }
  }
}

export interface OperationMethods {
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
