import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from "openapi-client-axios";

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
  namespace ApiControllerAssetUpload {
    export type RequestBody = Components.Schemas.FilesUploadDto;
    namespace Responses {
      export type $202 = Components.Schemas.UploadResponseDto;
    }
  }
  namespace ApiControllerBroadcast {
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
  namespace ApiControllerDelete {
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
  namespace ApiControllerHealth {
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace ApiControllerProfile {
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
  namespace ApiControllerReaction {
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
  namespace ApiControllerReply {
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
  namespace ApiControllerUpdate {
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
}

export interface OperationMethods {
  /**
   * ApiController_health
   */
  "ApiController_health"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.ApiControllerHealth.Responses.$200>;
  /**
   * ApiController_assetUpload
   */
  "ApiController_assetUpload"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ApiControllerAssetUpload.RequestBody,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.ApiControllerAssetUpload.Responses.$202>;
  /**
   * ApiController_broadcast
   */
  "ApiController_broadcast"(
    parameters: Parameters<Paths.ApiControllerBroadcast.PathParameters>,
    data?: Paths.ApiControllerBroadcast.RequestBody,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.ApiControllerBroadcast.Responses.$202>;
  /**
   * ApiController_reply
   */
  "ApiController_reply"(
    parameters: Parameters<Paths.ApiControllerReply.PathParameters>,
    data?: Paths.ApiControllerReply.RequestBody,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.ApiControllerReply.Responses.$202>;
  /**
   * ApiController_reaction
   */
  "ApiController_reaction"(
    parameters: Parameters<Paths.ApiControllerReaction.PathParameters>,
    data?: Paths.ApiControllerReaction.RequestBody,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.ApiControllerReaction.Responses.$202>;
  /**
   * ApiController_update
   */
  "ApiController_update"(
    parameters: Parameters<Paths.ApiControllerUpdate.PathParameters>,
    data?: Paths.ApiControllerUpdate.RequestBody,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.ApiControllerUpdate.Responses.$202>;
  /**
   * ApiController_delete
   */
  "ApiController_delete"(
    parameters: Parameters<Paths.ApiControllerDelete.PathParameters>,
    data?: Paths.ApiControllerDelete.RequestBody,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.ApiControllerDelete.Responses.$202>;
  /**
   * ApiController_profile
   */
  "ApiController_profile"(
    parameters: Parameters<Paths.ApiControllerProfile.PathParameters>,
    data?: Paths.ApiControllerProfile.RequestBody,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.ApiControllerProfile.Responses.$202>;
}

export interface PathsDictionary {
  ["/api/health"]: {
    /**
     * ApiController_health
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ApiControllerHealth.Responses.$200>;
  };
  ["/api/asset/upload"]: {
    /**
     * ApiController_assetUpload
     */
    "put"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ApiControllerAssetUpload.RequestBody,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ApiControllerAssetUpload.Responses.$202>;
  };
  ["/api/content/{userDsnpId}/broadcast"]: {
    /**
     * ApiController_broadcast
     */
    "post"(
      parameters: Parameters<Paths.ApiControllerBroadcast.PathParameters>,
      data?: Paths.ApiControllerBroadcast.RequestBody,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ApiControllerBroadcast.Responses.$202>;
  };
  ["/api/content/{userDsnpId}/reply"]: {
    /**
     * ApiController_reply
     */
    "post"(
      parameters: Parameters<Paths.ApiControllerReply.PathParameters>,
      data?: Paths.ApiControllerReply.RequestBody,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ApiControllerReply.Responses.$202>;
  };
  ["/api/content/{userDsnpId}/reaction"]: {
    /**
     * ApiController_reaction
     */
    "post"(
      parameters: Parameters<Paths.ApiControllerReaction.PathParameters>,
      data?: Paths.ApiControllerReaction.RequestBody,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ApiControllerReaction.Responses.$202>;
  };
  ["/api/content/{userDsnpId}"]: {
    /**
     * ApiController_update
     */
    "put"(
      parameters: Parameters<Paths.ApiControllerUpdate.PathParameters>,
      data?: Paths.ApiControllerUpdate.RequestBody,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ApiControllerUpdate.Responses.$202>;
    /**
     * ApiController_delete
     */
    "delete"(
      parameters: Parameters<Paths.ApiControllerDelete.PathParameters>,
      data?: Paths.ApiControllerDelete.RequestBody,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ApiControllerDelete.Responses.$202>;
  };
  ["/api/profile/{userDsnpId}"]: {
    /**
     * ApiController_profile
     */
    "put"(
      parameters: Parameters<Paths.ApiControllerProfile.PathParameters>,
      data?: Paths.ApiControllerProfile.RequestBody,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ApiControllerProfile.Responses.$202>;
  };
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>;
