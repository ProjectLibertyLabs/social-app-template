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
            type: "link" | "image" | "audio" | "video";
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
            units?: "cm" | "m" | "km" | "inches" | "feet" | "miles";
        }
        export interface NoteActivityDto {
            content: string;
            published: string; // ISO8601_REGEX
            assets?: AssetDto[];
            name?: string;
            tag?: TagDto[];
            location?: LocationDto;
        }
        export interface ProfileActivityDto {
            icon?: AssetReferenceDto[];
            summary?: string;
            published?: string; // ISO8601_REGEX
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
            inReplyTo: string; // DSNP_CONTENT_URI_REGEX
        }
        export interface ReplyDto {
            inReplyTo: string; // DSNP_CONTENT_URI_REGEX
            content: NoteActivityDto;
        }
        export interface TagDto {
            type: "mention" | "hashtag";
            name?: string;
            mentionedId?: string; // DSNP_USER_URI_REGEX
        }
        export interface TombstoneDto {
            targetContentHash: string; // DSNP_CONTENT_HASH_REGEX
            targetAnnouncementType: "broadcast" | "reply";
        }
        export interface UpdateDto {
            targetContentHash: string; // DSNP_CONTENT_HASH_REGEX
            targetAnnouncementType: "broadcast" | "reply";
            content: NoteActivityDto;
        }
        export interface UploadResponseDto {
            assetIds: string[];
        }
    }
}
declare namespace Paths {
    namespace AssetControllerAssetUpload {
        export type RequestBody = Components.Schemas.FilesUploadDto;
        namespace Responses {
            export type $202 = Components.Schemas.UploadResponseDto;
        }
    }
    namespace ContentControllerBroadcast {
        namespace Parameters {
            export type UserDsnpId = string;
        }
        export interface PathParameters {
            userDsnpId: Parameters.UserDsnpId;
        }
        export type RequestBody = Components.Schemas.BroadcastDto;
        namespace Responses {
            export type $202 = Components.Schemas.AnnouncementResponseDto;
        }
    }
    namespace ContentControllerDelete {
        namespace Parameters {
            export type UserDsnpId = string;
        }
        export interface PathParameters {
            userDsnpId: Parameters.UserDsnpId;
        }
        export type RequestBody = Components.Schemas.TombstoneDto;
        namespace Responses {
            export type $202 = Components.Schemas.AnnouncementResponseDto;
        }
    }
    namespace ContentControllerReaction {
        namespace Parameters {
            export type UserDsnpId = string;
        }
        export interface PathParameters {
            userDsnpId: Parameters.UserDsnpId;
        }
        export type RequestBody = Components.Schemas.ReactionDto;
        namespace Responses {
            export type $202 = Components.Schemas.AnnouncementResponseDto;
        }
    }
    namespace ContentControllerReply {
        namespace Parameters {
            export type UserDsnpId = string;
        }
        export interface PathParameters {
            userDsnpId: Parameters.UserDsnpId;
        }
        export type RequestBody = Components.Schemas.ReplyDto;
        namespace Responses {
            export type $202 = Components.Schemas.AnnouncementResponseDto;
        }
    }
    namespace ContentControllerUpdate {
        namespace Parameters {
            export type UserDsnpId = string;
        }
        export interface PathParameters {
            userDsnpId: Parameters.UserDsnpId;
        }
        export type RequestBody = Components.Schemas.UpdateDto;
        namespace Responses {
            export type $202 = Components.Schemas.AnnouncementResponseDto;
        }
    }
    namespace DevelopmentControllerGetAsset {
        namespace Parameters {
            export type AssetId = string;
        }
        export interface PathParameters {
            assetId: Parameters.AssetId;
        }
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace DevelopmentControllerPopulate {
        namespace Parameters {
            export type Count = number;
            export type QueueType = string;
        }
        export interface PathParameters {
            queueType: Parameters.QueueType;
            count: Parameters.Count;
        }
        namespace Responses {
            export interface $201 {
            }
        }
    }
    namespace DevelopmentControllerRequestJob {
        namespace Parameters {
            export type JobId = string;
        }
        export interface PathParameters {
            jobId: Parameters.JobId;
        }
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace HealthControllerHealthz {
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace HealthControllerLivez {
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace HealthControllerReadyz {
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace ProfileControllerProfile {
        namespace Parameters {
            export type UserDsnpId = string;
        }
        export interface PathParameters {
            userDsnpId: Parameters.UserDsnpId;
        }
        export type RequestBody = Components.Schemas.ProfileDto;
        namespace Responses {
            export type $202 = Components.Schemas.AnnouncementResponseDto;
        }
    }
}

export interface OperationMethods {
  /**
   * AssetController_assetUpload - Upload Asset Files
   */
  'AssetController_assetUpload'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AssetControllerAssetUpload.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AssetControllerAssetUpload.Responses.$202>
  /**
   * ContentController_broadcast - Create DSNP Broadcast for User
   */
  'ContentController_broadcast'(
    parameters: Parameters<Paths.ContentControllerBroadcast.PathParameters>,
    data?: Paths.ContentControllerBroadcast.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ContentControllerBroadcast.Responses.$202>
  /**
   * ContentController_reply - Create DSNP Reply for User
   */
  'ContentController_reply'(
    parameters: Parameters<Paths.ContentControllerReply.PathParameters>,
    data?: Paths.ContentControllerReply.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ContentControllerReply.Responses.$202>
  /**
   * ContentController_reaction - Create DSNP Reaction for User
   */
  'ContentController_reaction'(
    parameters: Parameters<Paths.ContentControllerReaction.PathParameters>,
    data?: Paths.ContentControllerReaction.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ContentControllerReaction.Responses.$202>
  /**
   * ContentController_update - Update DSNP Content for User
   */
  'ContentController_update'(
    parameters: Parameters<Paths.ContentControllerUpdate.PathParameters>,
    data?: Paths.ContentControllerUpdate.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ContentControllerUpdate.Responses.$202>
  /**
   * ContentController_delete - Delete DSNP Content for User
   */
  'ContentController_delete'(
    parameters: Parameters<Paths.ContentControllerDelete.PathParameters>,
    data?: Paths.ContentControllerDelete.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ContentControllerDelete.Responses.$202>
  /**
   * ProfileController_profile - Update a user's Profile
   */
  'ProfileController_profile'(
    parameters: Parameters<Paths.ProfileControllerProfile.PathParameters>,
    data?: Paths.ProfileControllerProfile.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ProfileControllerProfile.Responses.$202>
  /**
   * HealthController_healthz - Check the health status of the service
   */
  'HealthController_healthz'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.HealthControllerHealthz.Responses.$200>
  /**
   * HealthController_livez - Check the live status of the service
   */
  'HealthController_livez'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.HealthControllerLivez.Responses.$200>
  /**
   * HealthController_readyz - Check the ready status of the service
   */
  'HealthController_readyz'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.HealthControllerReadyz.Responses.$200>
  /**
   * DevelopmentController_requestJob - Get a Job given a jobId
   * 
   * ONLY enabled when ENVIRONMENT="dev".
   */
  'DevelopmentController_requestJob'(
    parameters: Parameters<Paths.DevelopmentControllerRequestJob.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DevelopmentControllerRequestJob.Responses.$200>
  /**
   * DevelopmentController_getAsset - Get an Asset given an assetId
   * 
   * ONLY enabled when ENVIRONMENT="dev".
   */
  'DevelopmentController_getAsset'(
    parameters: Parameters<Paths.DevelopmentControllerGetAsset.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DevelopmentControllerGetAsset.Responses.$200>
  /**
   * DevelopmentController_populate - Create dummy announcement data
   * 
   * ONLY enabled when ENVIRONMENT="dev".
   */
  'DevelopmentController_populate'(
    parameters: Parameters<Paths.DevelopmentControllerPopulate.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DevelopmentControllerPopulate.Responses.$201>
}

export interface PathsDictionary {
  ['/v1/asset/upload']: {
    /**
     * AssetController_assetUpload - Upload Asset Files
     */
    'put'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AssetControllerAssetUpload.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AssetControllerAssetUpload.Responses.$202>
  }
  ['/v1/content/{userDsnpId}/broadcast']: {
    /**
     * ContentController_broadcast - Create DSNP Broadcast for User
     */
    'post'(
      parameters: Parameters<Paths.ContentControllerBroadcast.PathParameters>,
      data?: Paths.ContentControllerBroadcast.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ContentControllerBroadcast.Responses.$202>
  }
  ['/v1/content/{userDsnpId}/reply']: {
    /**
     * ContentController_reply - Create DSNP Reply for User
     */
    'post'(
      parameters: Parameters<Paths.ContentControllerReply.PathParameters>,
      data?: Paths.ContentControllerReply.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ContentControllerReply.Responses.$202>
  }
  ['/v1/content/{userDsnpId}/reaction']: {
    /**
     * ContentController_reaction - Create DSNP Reaction for User
     */
    'post'(
      parameters: Parameters<Paths.ContentControllerReaction.PathParameters>,
      data?: Paths.ContentControllerReaction.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ContentControllerReaction.Responses.$202>
  }
  ['/v1/content/{userDsnpId}']: {
    /**
     * ContentController_update - Update DSNP Content for User
     */
    'put'(
      parameters: Parameters<Paths.ContentControllerUpdate.PathParameters>,
      data?: Paths.ContentControllerUpdate.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ContentControllerUpdate.Responses.$202>
    /**
     * ContentController_delete - Delete DSNP Content for User
     */
    'delete'(
      parameters: Parameters<Paths.ContentControllerDelete.PathParameters>,
      data?: Paths.ContentControllerDelete.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ContentControllerDelete.Responses.$202>
  }
  ['/v1/profile/{userDsnpId}']: {
    /**
     * ProfileController_profile - Update a user's Profile
     */
    'put'(
      parameters: Parameters<Paths.ProfileControllerProfile.PathParameters>,
      data?: Paths.ProfileControllerProfile.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ProfileControllerProfile.Responses.$202>
  }
  ['/healthz']: {
    /**
     * HealthController_healthz - Check the health status of the service
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.HealthControllerHealthz.Responses.$200>
  }
  ['/livez']: {
    /**
     * HealthController_livez - Check the live status of the service
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.HealthControllerLivez.Responses.$200>
  }
  ['/readyz']: {
    /**
     * HealthController_readyz - Check the ready status of the service
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.HealthControllerReadyz.Responses.$200>
  }
  ['/dev/request/{jobId}']: {
    /**
     * DevelopmentController_requestJob - Get a Job given a jobId
     * 
     * ONLY enabled when ENVIRONMENT="dev".
     */
    'get'(
      parameters: Parameters<Paths.DevelopmentControllerRequestJob.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DevelopmentControllerRequestJob.Responses.$200>
  }
  ['/dev/asset/{assetId}']: {
    /**
     * DevelopmentController_getAsset - Get an Asset given an assetId
     * 
     * ONLY enabled when ENVIRONMENT="dev".
     */
    'get'(
      parameters: Parameters<Paths.DevelopmentControllerGetAsset.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DevelopmentControllerGetAsset.Responses.$200>
  }
  ['/dev/dummy/announcement/{queueType}/{count}']: {
    /**
     * DevelopmentController_populate - Create dummy announcement data
     * 
     * ONLY enabled when ENVIRONMENT="dev".
     */
    'post'(
      parameters: Parameters<Paths.DevelopmentControllerPopulate.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DevelopmentControllerPopulate.Responses.$201>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
