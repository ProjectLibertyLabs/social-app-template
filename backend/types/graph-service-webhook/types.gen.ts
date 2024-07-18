// This file is auto-generated by @hey-api/openapi-ts

export type Uint8Array = unknown;

export type PersistPageUpdate = {
  type: 'PersistPage';
  /**
   * MSA of graph owner
   */
  ownerDsnpUserId: string;
  /**
   * Schema ID of graph schema
   */
  schemaId: number;
  /**
   * Page ID of graph page being updated
   */
  pageId: number;
  /**
   * Content hash of last known state of graph page
   */
  prevHash: number;
  /**
   * Byte array of graph page data
   */
  payload: Uint8Array;
};

export enum type {
  PERSIST_PAGE = 'PersistPage',
}

export type DeletePageUpdate = {
  type: 'DeletePage';
  ownerDsnpUserId: string;
  schemaId: number;
  pageId: number;
  prevHash: number;
};

export enum type2 {
  DELETE_PAGE = 'DeletePage',
}

export type AddKeyUpdate = {
  type: 'AddKey';
  ownerDsnpUserId: string;
  prevHash: number;
};

export enum type3 {
  ADD_KEY = 'AddKey',
}

export type GraphChangeNotification = {
  /**
   * MSA ID for which this notification is being sent
   */
  msaId: string;
  /**
   * The payload of the specific update. Content depends on the type of update (Add, Delete, Persist)
   */
  update: PersistPageUpdate | DeletePageUpdate | AddKeyUpdate;
};

export type GraphOperationStatus = {
  /**
   * Job reference ID of a previously submitted graph update request
   */
  referenceId: string;
  status: 'pending' | 'expired' | 'failed' | 'succeeded';
};

export enum status {
  PENDING = 'pending',
  EXPIRED = 'expired',
  FAILED = 'failed',
  SUCCEEDED = 'succeeded',
}
