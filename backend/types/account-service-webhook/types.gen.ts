// This file is auto-generated by @hey-api/openapi-ts

export enum TransactionType {
  CHANGE_HANDLE = 'CHANGE_HANDLE',
  CREATE_HANDLE = 'CREATE_HANDLE',
  SIWF_SIGNUP = 'SIWF_SIGNUP',
  SIWF_SIGNIN = 'SIWF_SIGNIN',
  ADD_KEY = 'ADD_KEY',
  RETIRE_MSA = 'RETIRE_MSA',
  ADD_PUBLIC_KEY_AGREEMENT = 'ADD_PUBLIC_KEY_AGREEMENT',
  REVOKE_DELEGATION = 'REVOKE_DELEGATION',
}

export type TxWebhookRspBase = {
  providerId: string;
  referenceId: string;
  msaId: string;
  transactionType?: TransactionType;
};

export type PublishHandleOpts = {
  handle: string;
};

export type SIWFOpts = {
  handle: string;
  accountId: string;
};

export type PublishKeysOpts = {
  newPublicKey: string;
};

export type PublishGraphKeysOpts = {
  schemaId: string;
};

export type TxWebhookOpts = PublishHandleOpts | SIWFOpts | PublishKeysOpts | PublishGraphKeysOpts;

export type PublishHandleWebhookRsp = TxWebhookRspBase &
  PublishHandleOpts & {
    transactionType?: 'CREATE_HANDLE' | 'CHANGE_HANDLE';
  };

export type SIWFWebhookRsp = TxWebhookRspBase &
  SIWFOpts & {
    transactionType?: 'SIWF_SIGNUP';
  };

export type PublishKeysWebhookRsp = TxWebhookRspBase &
  PublishKeysOpts & {
    transactionType?: 'ADD_KEY';
  };

export type PublishGraphKeysWebhookRsp = TxWebhookRspBase &
  PublishGraphKeysOpts & {
    transactionType?: 'ADD_PUBLIC_KEY_AGREEMENT';
  };

export type RetireMsaWebhookRsp = TxWebhookRspBase & {
  transactionType?: 'RETIRE_MSA';
};

export type RevokeDelegationWebhookRsp = TxWebhookRspBase & {
  transactionType?: 'REVOKE_DELEGATION';
};

export type TxWebhookRsp =
  | PublishHandleWebhookRsp
  | SIWFWebhookRsp
  | PublishKeysWebhookRsp
  | PublishGraphKeysWebhookRsp
  | RetireMsaWebhookRsp
  | RevokeDelegationWebhookRsp;
