import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Components {
  namespace Schemas {
    export interface ConnectionDto {
      /**
       * example:
       * public
       */
      privacyType: /* Indicator connection type (public or private) */ PrivacyType;
      /**
       * example:
       * connectionTo
       */
      direction: /* Indicator of the direction of this connection */ Direction;
      /**
       * example:
       * follow
       */
      connectionType: /* Indicator of the type of connection (follow or friendship) */ ConnectionType;
      /**
       * MSA Id representing the target of this connection
       * example:
       * 3
       */
      dsnpId: string;
    }
    export interface ConnectionDtoWrapper {
      /**
       * Wrapper object for array of connections
       */
      data: ConnectionDto[];
    }
    /**
     * Indicator of the type of connection (follow or friendship)
     */
    export type ConnectionType = 'follow' | 'friendship';
    /**
     * Indicator of the direction of this connection
     */
    export type Direction = 'connectionTo' | 'connectionFrom' | 'bidirectional' | 'disconnect';
    export interface DsnpGraphEdgeDto {
      /**
       * MSA Id of the user represented by this graph edge
       * example:
       * 3
       */
      userId: string;
      /**
       * Block number when connection represented by this graph edge was created
       * example:
       * 12
       */
      since: number;
    }
    export interface GraphChangeResponseDto {
      /**
       * Reference ID by which the results/status of a submitted GraphChangeRequest may be retrieved
       * example:
       * bee2d0d2f658126c563088217e106f2fa9e56ed4
       */
      referenceId: string;
    }
    export interface GraphKeyPairDto {
      /**
       * example:
       * X25519
       */
      keyType: /* Key type of graph encryption keypair (currently only X25519 supported) */ KeyType;
      /**
       * Public graph encryption key as a hex string (prefixed with "0x")
       * example:
       * 0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
       */
      publicKey: string;
      /**
       * Private graph encryption key as a hex string (prefixed with "0x")
       * example:
       * 0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
       */
      privateKey: string;
    }
    export interface GraphsQueryParamsDto {
      /**
       * example:
       * public
       */
      privacyType: /* Indicator connection type (public or private) */ PrivacyType;
      /**
       * example:
       * follow
       */
      connectionType: /* Indicator of the type of connection (follow or friendship) */ ConnectionType;
      /**
       * Array of MSA Ids for which to query graphs
       * example:
       * [
       *   "2",
       *   "3",
       *   "4",
       *   "5"
       * ]
       */
      dsnpIds: string[];
      /**
       * Graph encryption keypairs for the users requested in `dsnpIds`. (Only for `privacyType` === "private"
       */
      graphKeyPairs?: GraphKeyPairDto[];
    }
    /**
     * Key type of graph encryption keypair (currently only X25519 supported)
     */
    export type KeyType = 'X25519';
    /**
     * Indicator connection type (public or private)
     */
    export type PrivacyType = 'private' | 'public';
    export interface ProviderGraphDto {
      /**
       * MSA Id that owns the connections represented in this object
       * example:
       * 2
       */
      dsnpId: string;
      /**
       * Array of connections known to the Provider for ths MSA referenced in this object
       */
      connections: {
        /**
         * Wrapper object for array of connections
         */
        data: ConnectionDto[];
      };
      /**
       * Optional array of graph encryption keypairs decrypting/encrypting the above-referenced users private graph
       */
      graphKeyPairs?: GraphKeyPairDto[];
      /**
       * Optional URL of a webhook to invoke when the request is complete
       * example:
       * http://localhost/webhook
       */
      webhookUrl?: string;
    }
    export interface UserGraphDto {
      /**
       * MSA Id that is the owner of the graph represented by the graph edges in this object
       * example:
       * 2
       */
      dsnpId: string;
      /**
       * Optional array of graph edges in the specific user graph represented by this object
       */
      dsnpGraphEdges?: DsnpGraphEdgeDto[];
      /**
       * Optional error message if the request failed
       */
      errorMessage?: string;
    }
    export interface WatchGraphsDto {
      /**
       * MSA Ids for which to watch for graph updates
       * example:
       * [
       *   "2",
       *   "3",
       *   "4",
       *   "5"
       * ]
       */
      dsnpIds?: string[];
      /**
       * Webhook URL to call when graph changes for the referenced MSAs are detected
       * example:
       * http://localhost/webhook
       */
      webhookEndpoint: string;
    }
  }
}
declare namespace Paths {
  namespace GraphControllerV1GetGraphs {
    export type RequestBody = Components.Schemas.GraphsQueryParamsDto;
    namespace Responses {
      export type $200 = Components.Schemas.UserGraphDto[];
    }
  }
  namespace GraphControllerV1UpdateGraph {
    export type RequestBody = Components.Schemas.ProviderGraphDto;
    namespace Responses {
      export type $201 = Components.Schemas.GraphChangeResponseDto;
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
  namespace WebhooksControllerV1DeleteAllWebhooks {
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace WebhooksControllerV1DeleteAllWebhooksForUrl {
    namespace Parameters {
      /**
       * example:
       * http://localhost/webhook
       */
      export type Url = string;
    }
    export interface QueryParameters {
      url: /**
       * example:
       * http://localhost/webhook
       */
      Parameters.Url;
    }
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace WebhooksControllerV1DeleteWebhooksForMsa {
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
      export interface $200 {}
    }
  }
  namespace WebhooksControllerV1GetAllWebhooks {
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace WebhooksControllerV1GetWebhooksForMsa {
    namespace Parameters {
      /**
       * example:
       * true
       */
      export type IncludeAll = boolean;
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
    export interface QueryParameters {
      includeAll?: /**
       * example:
       * true
       */
      Parameters.IncludeAll;
    }
    namespace Responses {
      export type $200 = string[];
    }
  }
  namespace WebhooksControllerV1GetWebhooksForUrl {
    namespace Parameters {
      /**
       * example:
       * http://localhost/webhook
       */
      export type Url = string;
    }
    export interface QueryParameters {
      url: /**
       * example:
       * http://localhost/webhook
       */
      Parameters.Url;
    }
    namespace Responses {
      export type $200 = string[];
    }
  }
  namespace WebhooksControllerV1WatchGraphs {
    export type RequestBody = Components.Schemas.WatchGraphsDto;
    namespace Responses {
      export interface $200 {}
    }
  }
}

export interface OperationMethods {
  /**
   * GraphControllerV1_getGraphs - Fetch graphs for specified MSA Ids and Block Number
   */
  'GraphControllerV1_getGraphs'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.GraphControllerV1GetGraphs.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GraphControllerV1GetGraphs.Responses.$200>;
  /**
   * GraphControllerV1_updateGraph - Request an update to a given user's graph
   */
  'GraphControllerV1_updateGraph'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.GraphControllerV1UpdateGraph.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GraphControllerV1UpdateGraph.Responses.$201>;
  /**
   * WebhooksControllerV1_getAllWebhooks - Get all registered webhooks
   */
  'WebhooksControllerV1_getAllWebhooks'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.WebhooksControllerV1GetAllWebhooks.Responses.$200>;
  /**
   * WebhooksControllerV1_watchGraphs - Watch graphs for specified dsnpIds and receive updates
   */
  'WebhooksControllerV1_watchGraphs'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.WebhooksControllerV1WatchGraphs.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.WebhooksControllerV1WatchGraphs.Responses.$200>;
  /**
   * WebhooksControllerV1_deleteAllWebhooks - Delete all registered webhooks
   */
  'WebhooksControllerV1_deleteAllWebhooks'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.WebhooksControllerV1DeleteAllWebhooks.Responses.$200>;
  /**
   * WebhooksControllerV1_getWebhooksForMsa - Get all registered webhooks for a specific MSA Id
   */
  'WebhooksControllerV1_getWebhooksForMsa'(
    parameters: Parameters<
      Paths.WebhooksControllerV1GetWebhooksForMsa.QueryParameters &
        Paths.WebhooksControllerV1GetWebhooksForMsa.PathParameters
    >,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.WebhooksControllerV1GetWebhooksForMsa.Responses.$200>;
  /**
   * WebhooksControllerV1_deleteWebhooksForMsa - Delete all webhooks registered for a specific MSA
   */
  'WebhooksControllerV1_deleteWebhooksForMsa'(
    parameters: Parameters<Paths.WebhooksControllerV1DeleteWebhooksForMsa.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.WebhooksControllerV1DeleteWebhooksForMsa.Responses.$200>;
  /**
   * WebhooksControllerV1_getWebhooksForUrl - Get all webhooks registered to the specified URL
   */
  'WebhooksControllerV1_getWebhooksForUrl'(
    parameters?: Parameters<Paths.WebhooksControllerV1GetWebhooksForUrl.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.WebhooksControllerV1GetWebhooksForUrl.Responses.$200>;
  /**
   * WebhooksControllerV1_deleteAllWebhooksForUrl - Delete all MSA webhooks registered with the given URL
   */
  'WebhooksControllerV1_deleteAllWebhooksForUrl'(
    parameters?: Parameters<Paths.WebhooksControllerV1DeleteAllWebhooksForUrl.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.WebhooksControllerV1DeleteAllWebhooksForUrl.Responses.$200>;
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
  ['/v1/graphs/getGraphs']: {
    /**
     * GraphControllerV1_getGraphs - Fetch graphs for specified MSA Ids and Block Number
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.GraphControllerV1GetGraphs.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GraphControllerV1GetGraphs.Responses.$200>;
  };
  ['/v1/graphs']: {
    /**
     * GraphControllerV1_updateGraph - Request an update to a given user's graph
     */
    'put'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.GraphControllerV1UpdateGraph.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GraphControllerV1UpdateGraph.Responses.$201>;
  };
  ['/v1/webhooks']: {
    /**
     * WebhooksControllerV1_getAllWebhooks - Get all registered webhooks
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.WebhooksControllerV1GetAllWebhooks.Responses.$200>;
    /**
     * WebhooksControllerV1_watchGraphs - Watch graphs for specified dsnpIds and receive updates
     */
    'put'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.WebhooksControllerV1WatchGraphs.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.WebhooksControllerV1WatchGraphs.Responses.$200>;
    /**
     * WebhooksControllerV1_deleteAllWebhooks - Delete all registered webhooks
     */
    'delete'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.WebhooksControllerV1DeleteAllWebhooks.Responses.$200>;
  };
  ['/v1/webhooks/users/{msaId}']: {
    /**
     * WebhooksControllerV1_getWebhooksForMsa - Get all registered webhooks for a specific MSA Id
     */
    'get'(
      parameters: Parameters<
        Paths.WebhooksControllerV1GetWebhooksForMsa.QueryParameters &
          Paths.WebhooksControllerV1GetWebhooksForMsa.PathParameters
      >,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.WebhooksControllerV1GetWebhooksForMsa.Responses.$200>;
    /**
     * WebhooksControllerV1_deleteWebhooksForMsa - Delete all webhooks registered for a specific MSA
     */
    'delete'(
      parameters: Parameters<Paths.WebhooksControllerV1DeleteWebhooksForMsa.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.WebhooksControllerV1DeleteWebhooksForMsa.Responses.$200>;
  };
  ['/v1/webhooks/urls']: {
    /**
     * WebhooksControllerV1_getWebhooksForUrl - Get all webhooks registered to the specified URL
     */
    'get'(
      parameters?: Parameters<Paths.WebhooksControllerV1GetWebhooksForUrl.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.WebhooksControllerV1GetWebhooksForUrl.Responses.$200>;
    /**
     * WebhooksControllerV1_deleteAllWebhooksForUrl - Delete all MSA webhooks registered with the given URL
     */
    'delete'(
      parameters?: Parameters<Paths.WebhooksControllerV1DeleteAllWebhooksForUrl.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.WebhooksControllerV1DeleteAllWebhooksForUrl.Responses.$200>;
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
