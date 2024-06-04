import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Components {
  namespace Schemas {
    export interface ChainWatchOptionsDto {
      /**
       * Specific schema ids to watch for
       * example:
       * [
       *   1,
       *   19
       * ]
       */
      schemaIds: number[];
      /**
       * Specific dsnpIds (msa_id) to watch for
       * example:
       * [
       *   "10074",
       *   "100001"
       * ]
       */
      dsnpIds: string[];
    }
    export interface ContentSearchRequestDto {
      /**
       * The starting block number to search from
       * example:
       * 100
       */
      startBlock: number;
      /**
       * The ending block number to search to
       * example:
       * 101
       */
      endBlock: number;
      /**
       * The schemaIds/dsnpIds to filter by
       */
      filters: {
        /**
         * Specific schema ids to watch for
         * example:
         * [
         *   1,
         *   19
         * ]
         */
        schemaIds: number[];
        /**
         * Specific dsnpIds (msa_id) to watch for
         * example:
         * [
         *   "10074",
         *   "100001"
         * ]
         */
        dsnpIds: string[];
      };
      id: string;
    }
    export interface ResetScannerDto {
      /**
       * The block number to reset the scanner to
       * example:
       * 0
       */
      blockNumber?: number;
      /**
       * Number of blocks to rewind the scanner to (from `blockNumber` if supplied; else from latest block
       * example:
       * 100
       */
      rewindOffset?: number;
      /**
       * Whether to schedule the new scan immediately or wait for the next scheduled interval
       * example:
       * true
       */
      immediate?: boolean;
    }
    export interface WebhookRegistrationDto {
      /**
       * Webhook URL
       * example:
       * https://example.com/webhook
       */
      url: string;
      /**
       * Announcement types to send to the webhook
       * example:
       * [
       *   "Broadcast",
       *   "Reaction",
       *   "Tombstone",
       *   "Reply",
       *   "Update"
       * ]
       */
      announcementTypes: string[];
    }
  }
}
declare namespace Paths {
  namespace ApiControllerClearAllWebHooks {
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace ApiControllerGetRegisteredWebhooks {
    namespace Responses {
      export type $200 = Components.Schemas.WebhookRegistrationDto[];
    }
  }
  namespace ApiControllerHealth {
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace ApiControllerPauseScanner {
    namespace Responses {
      export interface $201 {}
    }
  }
  namespace ApiControllerRegisterWebhook {
    export type RequestBody = Components.Schemas.WebhookRegistrationDto;
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace ApiControllerResetScanner {
    export type RequestBody = Components.Schemas.ResetScannerDto;
    namespace Responses {
      export type $201 = string;
    }
  }
  namespace ApiControllerSearch {
    export type RequestBody = Components.Schemas.ContentSearchRequestDto;
    namespace Responses {
      export type $200 = string;
    }
  }
  namespace ApiControllerSetWatchOptions {
    export type RequestBody = Components.Schemas.ChainWatchOptionsDto;
    namespace Responses {
      export interface $201 {}
    }
  }
  namespace ApiControllerStartScanner {
    namespace Parameters {
      export type Immediate = boolean;
    }
    export interface QueryParameters {
      immediate?: Parameters.Immediate;
    }
    namespace Responses {
      export interface $201 {}
    }
  }
}

export interface OperationMethods {
  /**
   * ApiController_health
   */
  'ApiController_health'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ApiControllerHealth.Responses.$200>;
  /**
   * ApiController_resetScanner
   */
  'ApiController_resetScanner'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ApiControllerResetScanner.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ApiControllerResetScanner.Responses.$201>;
  /**
   * ApiController_setWatchOptions
   */
  'ApiController_setWatchOptions'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ApiControllerSetWatchOptions.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ApiControllerSetWatchOptions.Responses.$201>;
  /**
   * ApiController_pauseScanner
   */
  'ApiController_pauseScanner'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ApiControllerPauseScanner.Responses.$201>;
  /**
   * ApiController_startScanner
   */
  'ApiController_startScanner'(
    parameters?: Parameters<Paths.ApiControllerStartScanner.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ApiControllerStartScanner.Responses.$201>;
  /**
   * ApiController_search
   */
  'ApiController_search'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ApiControllerSearch.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ApiControllerSearch.Responses.$200>;
  /**
   * ApiController_registerWebhook
   */
  'ApiController_registerWebhook'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ApiControllerRegisterWebhook.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ApiControllerRegisterWebhook.Responses.$200>;
  /**
   * ApiController_clearAllWebHooks
   */
  'ApiController_clearAllWebHooks'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ApiControllerClearAllWebHooks.Responses.$200>;
  /**
   * ApiController_getRegisteredWebhooks
   */
  'ApiController_getRegisteredWebhooks'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ApiControllerGetRegisteredWebhooks.Responses.$200>;
}

export interface PathsDictionary {
  ['/api/health']: {
    /**
     * ApiController_health
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ApiControllerHealth.Responses.$200>;
  };
  ['/api/resetScanner']: {
    /**
     * ApiController_resetScanner
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ApiControllerResetScanner.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ApiControllerResetScanner.Responses.$201>;
  };
  ['/api/setWatchOptions']: {
    /**
     * ApiController_setWatchOptions
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ApiControllerSetWatchOptions.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ApiControllerSetWatchOptions.Responses.$201>;
  };
  ['/api/pauseScanner']: {
    /**
     * ApiController_pauseScanner
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ApiControllerPauseScanner.Responses.$201>;
  };
  ['/api/startScanner']: {
    /**
     * ApiController_startScanner
     */
    'post'(
      parameters?: Parameters<Paths.ApiControllerStartScanner.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ApiControllerStartScanner.Responses.$201>;
  };
  ['/api/search']: {
    /**
     * ApiController_search
     */
    'put'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ApiControllerSearch.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ApiControllerSearch.Responses.$200>;
  };
  ['/api/registerWebhook']: {
    /**
     * ApiController_registerWebhook
     */
    'put'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ApiControllerRegisterWebhook.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ApiControllerRegisterWebhook.Responses.$200>;
  };
  ['/api/clearAllWebHooks']: {
    /**
     * ApiController_clearAllWebHooks
     */
    'delete'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ApiControllerClearAllWebHooks.Responses.$200>;
  };
  ['/api/getRegisteredWebhooks']: {
    /**
     * ApiController_getRegisteredWebhooks
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ApiControllerGetRegisteredWebhooks.Responses.$200>;
  };
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>;
