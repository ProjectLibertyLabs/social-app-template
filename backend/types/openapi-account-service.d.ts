import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from "openapi-client-axios";

declare namespace Components {
  namespace Schemas {
    export interface EncodedExtrinsicDto {
      pallet: string;
      extrinsicName: string;
      encodedExtrinsic: string;
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
      proof: string;
    }
    export interface KeysRequest {
      msaOwnerAddress: string;
      msaOwnerSignature: string;
      newKeyOwnerSignature: string;
      payload: KeysRequestPayload;
    }
    export interface KeysRequestPayload {
      msaId: number;
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
      signature: string;
    }
    export interface WalletLoginConfigResponse {
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
  namespace AccountsControllerGetAccount {
    namespace Parameters {
      export type MsaId = number;
    }
    export interface PathParameters {
      msaId: Parameters.MsaId;
    }
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace AccountsControllerGetSIWFConfig {
    namespace Responses {
      export type $200 = Components.Schemas.WalletLoginConfigResponse;
    }
  }
  namespace AccountsControllerSignInWithFrequency {
    export type RequestBody = Components.Schemas.WalletLoginRequestDto;
    namespace Responses {
      export type $201 = Components.Schemas.WalletLoginResponse;
    }
  }
  namespace ApiControllerHealth {
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace DelegationControllerGetDelegation {
    namespace Parameters {
      export type MsaId = number;
    }
    export interface PathParameters {
      msaId: Parameters.MsaId;
    }
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace HandlesControllerChangeHandle {
    export type RequestBody = Components.Schemas.HandleRequest;
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace HandlesControllerCreateHandle {
    export type RequestBody = Components.Schemas.HandleRequest;
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace HandlesControllerGetHandle {
    namespace Parameters {
      export type MsaId = number;
    }
    export interface PathParameters {
      msaId: Parameters.MsaId;
    }
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace KeysControllerAddKey {
    export type RequestBody = Components.Schemas.KeysRequest;
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace KeysControllerGetKeys {
    namespace Parameters {
      export type MsaId = number;
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
   * ApiController_health - Check the health status of the service
   */
  "ApiController_health"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.ApiControllerHealth.Responses.$200>;
  /**
   * AccountsController_getSIWFConfig - Get the Sign-In With Frequency Configuration
   */
  "AccountsController_getSIWFConfig"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.AccountsControllerGetSIWFConfig.Responses.$200>;
  /**
   * AccountsController_signInWithFrequency - Request to sign in with Frequency
   */
  "AccountsController_signInWithFrequency"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AccountsControllerSignInWithFrequency.RequestBody,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.AccountsControllerSignInWithFrequency.Responses.$201>;
  /**
   * AccountsController_getAccount - Fetch an account given an msaId.
   */
  "AccountsController_getAccount"(
    parameters: Parameters<Paths.AccountsControllerGetAccount.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.AccountsControllerGetAccount.Responses.$200>;
  /**
   * DelegationController_getDelegation - Get the delegation information associated with an msaId.
   */
  "DelegationController_getDelegation"(
    parameters: Parameters<Paths.DelegationControllerGetDelegation.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.DelegationControllerGetDelegation.Responses.$200>;
  /**
   * KeysController_addKey - add new control keys for an MSA ID
   */
  "KeysController_addKey"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.KeysControllerAddKey.RequestBody,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.KeysControllerAddKey.Responses.$200>;
  /**
   * KeysController_getKeys - Fetch public keys given an msaId.
   */
  "KeysController_getKeys"(
    parameters: Parameters<Paths.KeysControllerGetKeys.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.KeysControllerGetKeys.Responses.$200>;
  /**
   * HandlesController_createHandle - Request to create a new handle for an account
   */
  "HandlesController_createHandle"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.HandlesControllerCreateHandle.RequestBody,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.HandlesControllerCreateHandle.Responses.$200>;
  /**
   * HandlesController_changeHandle - Request to change a handle
   */
  "HandlesController_changeHandle"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.HandlesControllerChangeHandle.RequestBody,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.HandlesControllerChangeHandle.Responses.$200>;
  /**
   * HandlesController_getHandle - Fetch a handle given an msaId.
   */
  "HandlesController_getHandle"(
    parameters: Parameters<Paths.HandlesControllerGetHandle.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.HandlesControllerGetHandle.Responses.$200>;
}

export interface PathsDictionary {
  ["/api/health"]: {
    /**
     * ApiController_health - Check the health status of the service
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ApiControllerHealth.Responses.$200>;
  };
  ["/accounts/siwf"]: {
    /**
     * AccountsController_getSIWFConfig - Get the Sign-In With Frequency Configuration
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.AccountsControllerGetSIWFConfig.Responses.$200>;
    /**
     * AccountsController_signInWithFrequency - Request to sign in with Frequency
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AccountsControllerSignInWithFrequency.RequestBody,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.AccountsControllerSignInWithFrequency.Responses.$201>;
  };
  ["/accounts/{msaId}"]: {
    /**
     * AccountsController_getAccount - Fetch an account given an msaId.
     */
    "get"(
      parameters: Parameters<Paths.AccountsControllerGetAccount.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.AccountsControllerGetAccount.Responses.$200>;
  };
  ["/delegation/{msaId}"]: {
    /**
     * DelegationController_getDelegation - Get the delegation information associated with an msaId.
     */
    "get"(
      parameters: Parameters<Paths.DelegationControllerGetDelegation.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.DelegationControllerGetDelegation.Responses.$200>;
  };
  ["/keys/add"]: {
    /**
     * KeysController_addKey - add new control keys for an MSA ID
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.KeysControllerAddKey.RequestBody,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.KeysControllerAddKey.Responses.$200>;
  };
  ["/keys/{msaId}"]: {
    /**
     * KeysController_getKeys - Fetch public keys given an msaId.
     */
    "get"(
      parameters: Parameters<Paths.KeysControllerGetKeys.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.KeysControllerGetKeys.Responses.$200>;
  };
  ["/handles"]: {
    /**
     * HandlesController_createHandle - Request to create a new handle for an account
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.HandlesControllerCreateHandle.RequestBody,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.HandlesControllerCreateHandle.Responses.$200>;
  };
  ["/handles/change"]: {
    /**
     * HandlesController_changeHandle - Request to change a handle
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.HandlesControllerChangeHandle.RequestBody,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.HandlesControllerChangeHandle.Responses.$200>;
  };
  ["/handles/{msaId}"]: {
    /**
     * HandlesController_getHandle - Fetch a handle given an msaId.
     */
    "get"(
      parameters: Parameters<Paths.HandlesControllerGetHandle.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.HandlesControllerGetHandle.Responses.$200>;
  };
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>;
