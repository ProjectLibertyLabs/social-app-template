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
            dsnpId: string;
            privacyType: "private" | "public";
            direction: "connectionTo" | "connectionFrom" | "bidirectional" | "disconnect";
            connectionType: "follow" | "friendship";
        }
        export interface DsnpGraphEdge {
            userId: string;
            since: number;
        }
        export interface GraphChangeRepsonseDto {
        }
        export interface GraphKeyPairDto {
            publicKey: string;
            privateKey: string;
            keyType: "X25519";
        }
        export interface GraphsQueryParamsDto {
            dsnpIds: string[];
            privacyType: "private" | "public";
            graphKeyPairs: GraphKeyPairDto[];
        }
        export interface ProviderGraphDto {
            dsnpId: string;
            connections: {
                data?: ConnectionDto[];
            };
            graphKeyPairs?: GraphKeyPairDto[];
        }
        export interface UserGraphDto {
            dsnpId: string;
            dsnpGraphEdges?: DsnpGraphEdge[];
        }
        export interface WatchGraphsDto {
            dsnpIds: string[];
            webhookEndpoint: string;
        }
    }
}
declare namespace Paths {
    namespace ApiControllerGetGraphs {
        export type RequestBody = Components.Schemas.GraphsQueryParamsDto;
        namespace Responses {
            export type $200 = Components.Schemas.UserGraphDto[];
        }
    }
    namespace ApiControllerHealth {
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace ApiControllerUpdateGraph {
        export type RequestBody = Components.Schemas.ProviderGraphDto;
        namespace Responses {
            export type $201 = Components.Schemas.GraphChangeRepsonseDto;
        }
    }
    namespace ApiControllerWatchGraphs {
        export type RequestBody = Components.Schemas.WatchGraphsDto;
        namespace Responses {
            export interface $200 {
            }
        }
    }
}

export interface OperationMethods {
  /**
   * ApiController_health - Check the health status of the service
   */
  'ApiController_health'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ApiControllerHealth.Responses.$200>
  /**
   * ApiController_getGraphs - Post a request to fetch graphs for specified dsnpIds and blockNumber
   */
  'ApiController_getGraphs'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ApiControllerGetGraphs.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ApiControllerGetGraphs.Responses.$200>
  /**
   * ApiController_updateGraph - Request an update to given users graph
   */
  'ApiController_updateGraph'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ApiControllerUpdateGraph.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ApiControllerUpdateGraph.Responses.$201>
  /**
   * ApiController_watchGraphs - Watch graphs for specified dsnpIds and receive updates
   */
  'ApiController_watchGraphs'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ApiControllerWatchGraphs.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ApiControllerWatchGraphs.Responses.$200>
}

export interface PathsDictionary {
  ['/api/health']: {
    /**
     * ApiController_health - Check the health status of the service
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ApiControllerHealth.Responses.$200>
  }
  ['/api/graphs']: {
    /**
     * ApiController_getGraphs - Post a request to fetch graphs for specified dsnpIds and blockNumber
     */
    'put'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ApiControllerGetGraphs.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ApiControllerGetGraphs.Responses.$200>
  }
  ['/api/update-graph']: {
    /**
     * ApiController_updateGraph - Request an update to given users graph
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ApiControllerUpdateGraph.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ApiControllerUpdateGraph.Responses.$201>
  }
  ['/api/watch-graphs']: {
    /**
     * ApiController_watchGraphs - Watch graphs for specified dsnpIds and receive updates
     */
    'put'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ApiControllerWatchGraphs.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ApiControllerWatchGraphs.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
