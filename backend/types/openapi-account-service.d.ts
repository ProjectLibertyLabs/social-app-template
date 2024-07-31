import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Components {
  namespace Schemas {
    export interface AccountResponse {
      msaId: string;
      handle?: {
        [key: string]: any;
      };
    }
    export interface EncodedExtrinsicDto {
      pallet: string;
      extrinsicName: string;
      encodedExtrinsic: {
        [key: string]: any;
      };
    }
    export interface ErrorResponseDto {
      message: string;
    }
    export interface HandlePayload {
      baseHandle: string;
      expiration: number;
    }
    export interface HandleRequest {
      accountId: string;
      payload: HandlePayload;
      proof: {
        [key: string]: any;
      };
    }
    export interface KeysRequest {
      msaOwnerAddress: string;
      msaOwnerSignature: {
        [key: string]: any;
      };
      newKeyOwnerSignature: {
        [key: string]: any;
      };
      payload: KeysRequestPayload;
    }
    export interface KeysRequestPayload {
      msaId: string;
      expiration: number;
      newPublicKey: string;
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
      signature: {
        [key: string]: any;
      };
    }
    export interface WalletLoginConfigResponse {
      providerId: string;
      siwfUrl: string;
      frequencyRpcUrl: string;
    }
    export interface WalletLoginRequestDto {
      /**
       * The wallet Login request information
       * example:
       * {
       *   "siwsPayload": {
       *     "message": "0x1234567890abcdef",
       *     "signature": "0x1234567890abcdef"
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
    export interface WalletLoginResponse {
      referenceId: string;
      msaId?: string;
      publicKey?: string;
    }
  }
}
declare namespace Paths {
  namespace AccountsControllerV1GetAccount {
    namespace Parameters {
      export type MsaId = string;
    }
    export interface PathParameters {
      msaId: Parameters.MsaId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.AccountResponse;
    }
  }
  namespace AccountsControllerV1GetSIWFConfig {
    namespace Responses {
      export type $200 = Components.Schemas.WalletLoginConfigResponse;
    }
  }
  namespace AccountsControllerV1PostSignInWithFrequency {
    export type RequestBody = Components.Schemas.WalletLoginRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.WalletLoginResponse;
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
      export interface $200 {}
    }
  }
  namespace HandlesControllerV1ChangeHandle {
    export type RequestBody = Components.Schemas.HandleRequest;
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace HandlesControllerV1CreateHandle {
    export type RequestBody = Components.Schemas.HandleRequest;
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
    export type RequestBody = Components.Schemas.KeysRequest;
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
}

export interface OperationMethods {
  /**
   * AccountsControllerV1_getSIWFConfig - Get the Sign-In With Frequency Configuration
   */
  'AccountsControllerV1_getSIWFConfig'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AccountsControllerV1GetSIWFConfig.Responses.$200>;
  /**
   * AccountsControllerV1_postSignInWithFrequency - Request to sign in with Frequency
   */
  'AccountsControllerV1_postSignInWithFrequency'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AccountsControllerV1PostSignInWithFrequency.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AccountsControllerV1PostSignInWithFrequency.Responses.$201>;
  /**
   * AccountsControllerV1_getAccount - Fetch an account given an msaId.
   */
  'AccountsControllerV1_getAccount'(
    parameters: Parameters<Paths.AccountsControllerV1GetAccount.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AccountsControllerV1GetAccount.Responses.$200>;
  /**
   * DelegationControllerV1_getDelegation - Get the delegation information associated with an msaId.
   */
  'DelegationControllerV1_getDelegation'(
    parameters: Parameters<Paths.DelegationControllerV1GetDelegation.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DelegationControllerV1GetDelegation.Responses.$200>;
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
   * HandlesControllerV1_getHandle - Fetch a handle given an msaId.
   */
  'HandlesControllerV1_getHandle'(
    parameters: Parameters<Paths.HandlesControllerV1GetHandle.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.HandlesControllerV1GetHandle.Responses.$200>;
  /**
   * KeysControllerV1_addKey - add new control keys for an MSA ID
   */
  'KeysControllerV1_addKey'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.KeysControllerV1AddKey.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.KeysControllerV1AddKey.Responses.$200>;
  /**
   * KeysControllerV1_getKeys - Fetch public keys given an msaId.
   */
  'KeysControllerV1_getKeys'(
    parameters: Parameters<Paths.KeysControllerV1GetKeys.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.KeysControllerV1GetKeys.Responses.$200>;
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
     * AccountsControllerV1_getSIWFConfig - Get the Sign-In With Frequency Configuration
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AccountsControllerV1GetSIWFConfig.Responses.$200>;
    /**
     * AccountsControllerV1_postSignInWithFrequency - Request to sign in with Frequency
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AccountsControllerV1PostSignInWithFrequency.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AccountsControllerV1PostSignInWithFrequency.Responses.$201>;
  };
  ['/v1/accounts/{msaId}']: {
    /**
     * AccountsControllerV1_getAccount - Fetch an account given an msaId.
     */
    'get'(
      parameters: Parameters<Paths.AccountsControllerV1GetAccount.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AccountsControllerV1GetAccount.Responses.$200>;
  };
  ['/v1/delegation/{msaId}']: {
    /**
     * DelegationControllerV1_getDelegation - Get the delegation information associated with an msaId.
     */
    'get'(
      parameters: Parameters<Paths.DelegationControllerV1GetDelegation.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DelegationControllerV1GetDelegation.Responses.$200>;
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
  ['/v1/handles/{msaId}']: {
    /**
     * HandlesControllerV1_getHandle - Fetch a handle given an msaId.
     */
    'get'(
      parameters: Parameters<Paths.HandlesControllerV1GetHandle.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.HandlesControllerV1GetHandle.Responses.$200>;
  };
  ['/v1/keys/add']: {
    /**
     * KeysControllerV1_addKey - add new control keys for an MSA ID
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.KeysControllerV1AddKey.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.KeysControllerV1AddKey.Responses.$200>;
  };
  ['/v1/keys/{msaId}']: {
    /**
     * KeysControllerV1_getKeys - Fetch public keys given an msaId.
     */
    'get'(
      parameters: Parameters<Paths.KeysControllerV1GetKeys.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.KeysControllerV1GetKeys.Responses.$200>;
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
