import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Components {
  namespace Schemas {
    export interface AnnouncementResponseDto {
      referenceId: string;
    }
    export interface AssetDto {
      references?: AssetReferenceDto[];
      name?: string;
      href?: string;
    }
    export interface AssetReferenceDto {
      referenceId: string;
      height?: number;
      width?: number;
      duration?: string; // DURATION_REGEX
    }
    export interface BroadcastDto {
      content: NoteActivityDto;
    }
    export interface FilesUploadDto {
      files: string /* binary */[];
    }
    export interface LocationDto {
      name: string;
      accuracy?: number;
      altitude?: number;
      latitude?: number;
      longitude?: number;
      radius?: number;
      units?: 'cm' | 'm' | 'km' | 'inches' | 'feet' | 'miles';
    }
    export interface NoteActivityDto {
      content: string;
      published: string;
      assets?: AssetDto[];
      name?: string;
      tag?: TagDto[];
      location?: LocationDto;
    }
    export interface ProfileActivityDto {
      icon?: AssetReferenceDto[];
      summary?: string;
      published?: string;
      name?: string;
      tag?: TagDto[];
      location?: LocationDto;
    }
    export interface ProfileDto {
      profile: ProfileActivityDto;
    }
    export interface ReactionDto {
      emoji: string; // DSNP_EMOJI_REGEX
      apply: number;
      inReplyTo: string;
    }
    export interface ReplyDto {
      inReplyTo: string;
      content: NoteActivityDto;
    }
    export interface TagDto {
      type: 'mention' | 'hashtag';
      name?: string;
      mentionedId?: string;
    }
    export interface TombstoneDto {
      targetContentHash: string;
      targetAnnouncementType: 'broadcast' | 'reply';
    }
    export interface UpdateDto {
      targetContentHash: string;
      targetAnnouncementType: 'broadcast' | 'reply';
      content: NoteActivityDto;
    }
    export interface UploadResponseDto {
      assetIds: string[];
    }
  }
}
declare namespace Paths {
  namespace AssetControllerV1AssetUpload {
    export type RequestBody = Components.Schemas.FilesUploadDto;
    namespace Responses {
      export type $2XX = Components.Schemas.UploadResponseDto;
    }
  }
  namespace ContentControllerV1Broadcast {
    namespace Parameters {
      export type UserDsnpId = string;
    }
    export interface PathParameters {
      userDsnpId: Parameters.UserDsnpId;
    }
    export type RequestBody = Components.Schemas.BroadcastDto;
    namespace Responses {
      export type $2XX = Components.Schemas.AnnouncementResponseDto;
    }
  }
  namespace ContentControllerV1Delete {
    namespace Parameters {
      export type UserDsnpId = string;
    }
    export interface PathParameters {
      userDsnpId: Parameters.UserDsnpId;
    }
    export type RequestBody = Components.Schemas.TombstoneDto;
    namespace Responses {
      export type $2XX = Components.Schemas.AnnouncementResponseDto;
    }
  }
  namespace ContentControllerV1Reaction {
    namespace Parameters {
      export type UserDsnpId = string;
    }
    export interface PathParameters {
      userDsnpId: Parameters.UserDsnpId;
    }
    export type RequestBody = Components.Schemas.ReactionDto;
    namespace Responses {
      export type $2XX = Components.Schemas.AnnouncementResponseDto;
    }
  }
  namespace ContentControllerV1Reply {
    namespace Parameters {
      export type UserDsnpId = string;
    }
    export interface PathParameters {
      userDsnpId: Parameters.UserDsnpId;
    }
    export type RequestBody = Components.Schemas.ReplyDto;
    namespace Responses {
      export type $2XX = Components.Schemas.AnnouncementResponseDto;
    }
  }
  namespace ContentControllerV1Update {
    namespace Parameters {
      export type UserDsnpId = string;
    }
    export interface PathParameters {
      userDsnpId: Parameters.UserDsnpId;
    }
    export type RequestBody = Components.Schemas.UpdateDto;
    namespace Responses {
      export type $2XX = Components.Schemas.AnnouncementResponseDto;
    }
  }
  namespace DevelopmentControllerV1GetAsset {
    namespace Parameters {
      export type AssetId = string;
    }
    export interface PathParameters {
      assetId: Parameters.AssetId;
    }
    namespace Responses {
      export type $2XX = string; // binary
    }
  }
  namespace DevelopmentControllerV1Populate {
    namespace Parameters {
      export type Count = number;
    }
    export interface PathParameters {
      count: Parameters.Count;
    }
    namespace Responses {
      export interface $201 {}
    }
  }
  namespace DevelopmentControllerV1RequestJob {
    namespace Parameters {
      export type JobId = string;
    }
    export interface PathParameters {
      jobId: Parameters.JobId;
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
  namespace ProfileControllerV1Profile {
    namespace Parameters {
      export type UserDsnpId = string;
    }
    export interface PathParameters {
      userDsnpId: Parameters.UserDsnpId;
    }
    export type RequestBody = Components.Schemas.ProfileDto;
    namespace Responses {
      export type $2XX = Components.Schemas.AnnouncementResponseDto;
    }
  }
}

export interface OperationMethods {
  /**
   * AssetControllerV1_assetUpload - Upload asset files
   */
  'AssetControllerV1_assetUpload'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AssetControllerV1AssetUpload.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AssetControllerV1AssetUpload.Responses.$2XX>;
  /**
   * ContentControllerV1_broadcast - Create DSNP Broadcast for user
   */
  'ContentControllerV1_broadcast'(
    parameters: Parameters<Paths.ContentControllerV1Broadcast.PathParameters>,
    data?: Paths.ContentControllerV1Broadcast.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ContentControllerV1Broadcast.Responses.$2XX>;
  /**
   * ContentControllerV1_reply - Create DSNP Reply for user
   */
  'ContentControllerV1_reply'(
    parameters: Parameters<Paths.ContentControllerV1Reply.PathParameters>,
    data?: Paths.ContentControllerV1Reply.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ContentControllerV1Reply.Responses.$2XX>;
  /**
   * ContentControllerV1_reaction - Create DSNP Reaction for user
   */
  'ContentControllerV1_reaction'(
    parameters: Parameters<Paths.ContentControllerV1Reaction.PathParameters>,
    data?: Paths.ContentControllerV1Reaction.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ContentControllerV1Reaction.Responses.$2XX>;
  /**
   * ContentControllerV1_update - Update DSNP Content for user
   */
  'ContentControllerV1_update'(
    parameters: Parameters<Paths.ContentControllerV1Update.PathParameters>,
    data?: Paths.ContentControllerV1Update.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ContentControllerV1Update.Responses.$2XX>;
  /**
   * ContentControllerV1_delete - Delete DSNP Content for user
   */
  'ContentControllerV1_delete'(
    parameters: Parameters<Paths.ContentControllerV1Delete.PathParameters>,
    data?: Paths.ContentControllerV1Delete.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ContentControllerV1Delete.Responses.$2XX>;
  /**
   * ProfileControllerV1_profile - Update a user's Profile
   */
  'ProfileControllerV1_profile'(
    parameters: Parameters<Paths.ProfileControllerV1Profile.PathParameters>,
    data?: Paths.ProfileControllerV1Profile.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ProfileControllerV1Profile.Responses.$2XX>;
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
  /**
   * DevelopmentControllerV1_requestJob - Get a Job given a jobId
   *
   * ONLY enabled when ENVIRONMENT="dev".
   */
  'DevelopmentControllerV1_requestJob'(
    parameters: Parameters<Paths.DevelopmentControllerV1RequestJob.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DevelopmentControllerV1RequestJob.Responses.$200>;
  /**
   * DevelopmentControllerV1_getAsset - Get an Asset given an assetId
   *
   * ONLY enabled when ENVIRONMENT="dev".
   */
  'DevelopmentControllerV1_getAsset'(
    parameters: Parameters<Paths.DevelopmentControllerV1GetAsset.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DevelopmentControllerV1GetAsset.Responses.$2XX>;
  /**
   * DevelopmentControllerV1_populate - Create dummy announcement data
   *
   * ONLY enabled when ENVIRONMENT="dev".
   */
  'DevelopmentControllerV1_populate'(
    parameters: Parameters<Paths.DevelopmentControllerV1Populate.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DevelopmentControllerV1Populate.Responses.$201>;
}

export interface PathsDictionary {
  ['/v1/asset/upload']: {
    /**
     * AssetControllerV1_assetUpload - Upload asset files
     */
    'put'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AssetControllerV1AssetUpload.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AssetControllerV1AssetUpload.Responses.$2XX>;
  };
  ['/v1/content/{userDsnpId}/broadcast']: {
    /**
     * ContentControllerV1_broadcast - Create DSNP Broadcast for user
     */
    'post'(
      parameters: Parameters<Paths.ContentControllerV1Broadcast.PathParameters>,
      data?: Paths.ContentControllerV1Broadcast.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ContentControllerV1Broadcast.Responses.$2XX>;
  };
  ['/v1/content/{userDsnpId}/reply']: {
    /**
     * ContentControllerV1_reply - Create DSNP Reply for user
     */
    'post'(
      parameters: Parameters<Paths.ContentControllerV1Reply.PathParameters>,
      data?: Paths.ContentControllerV1Reply.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ContentControllerV1Reply.Responses.$2XX>;
  };
  ['/v1/content/{userDsnpId}/reaction']: {
    /**
     * ContentControllerV1_reaction - Create DSNP Reaction for user
     */
    'post'(
      parameters: Parameters<Paths.ContentControllerV1Reaction.PathParameters>,
      data?: Paths.ContentControllerV1Reaction.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ContentControllerV1Reaction.Responses.$2XX>;
  };
  ['/v1/content/{userDsnpId}']: {
    /**
     * ContentControllerV1_update - Update DSNP Content for user
     */
    'put'(
      parameters: Parameters<Paths.ContentControllerV1Update.PathParameters>,
      data?: Paths.ContentControllerV1Update.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ContentControllerV1Update.Responses.$2XX>;
    /**
     * ContentControllerV1_delete - Delete DSNP Content for user
     */
    'delete'(
      parameters: Parameters<Paths.ContentControllerV1Delete.PathParameters>,
      data?: Paths.ContentControllerV1Delete.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ContentControllerV1Delete.Responses.$2XX>;
  };
  ['/v1/profile/{userDsnpId}']: {
    /**
     * ProfileControllerV1_profile - Update a user's Profile
     */
    'put'(
      parameters: Parameters<Paths.ProfileControllerV1Profile.PathParameters>,
      data?: Paths.ProfileControllerV1Profile.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ProfileControllerV1Profile.Responses.$2XX>;
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
  ['/dev/request/{jobId}']: {
    /**
     * DevelopmentControllerV1_requestJob - Get a Job given a jobId
     *
     * ONLY enabled when ENVIRONMENT="dev".
     */
    'get'(
      parameters: Parameters<Paths.DevelopmentControllerV1RequestJob.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DevelopmentControllerV1RequestJob.Responses.$200>;
  };
  ['/dev/asset/{assetId}']: {
    /**
     * DevelopmentControllerV1_getAsset - Get an Asset given an assetId
     *
     * ONLY enabled when ENVIRONMENT="dev".
     */
    'get'(
      parameters: Parameters<Paths.DevelopmentControllerV1GetAsset.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DevelopmentControllerV1GetAsset.Responses.$2XX>;
  };
  ['/dev/dummy/announcement/{queueType}/{count}']: {
    /**
     * DevelopmentControllerV1_populate - Create dummy announcement data
     *
     * ONLY enabled when ENVIRONMENT="dev".
     */
    'post'(
      parameters: Parameters<Paths.DevelopmentControllerV1Populate.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DevelopmentControllerV1Populate.Responses.$201>;
  };
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>;
