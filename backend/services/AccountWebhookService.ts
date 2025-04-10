import { HttpStatusCode } from 'axios';
import logger from '../logger';
import { HttpError } from '../types/HttpError';
import { SIWFWebhookRsp, TransactionType, TxWebhookRsp } from '../types/account-service-webhook';
import { sseManager } from '../utils/sse';

// TODO: this should probably use a limited lifetime cache entry, as the current
// implementation can grow unbounded
export const referenceIdsReceived: Map<string, TxWebhookRsp> = new Map();

/**
 * Handles the webhook from the account service.
 * @param _req - The request object, contains the on-chain data from the account-service for the referenceId.
 * @param res - The response object.
 */
export function accountServiceWebhook(payload: TxWebhookRsp) {
  const { referenceId, transactionType } = payload;
  const requiredFields: string[] = ['referenceId', 'providerId', 'msaId', 'transactionType'];
  logger.debug(`Received webhook response for refId "${referenceId}": ${JSON.stringify(payload)}`);

  switch (transactionType as unknown as TransactionType) {
    case TransactionType.ADD_KEY:
      requiredFields.push('newPublicKey');
      break;

    case TransactionType.ADD_PUBLIC_KEY_AGREEMENT:
      requiredFields.push('schemaId');
      break;

    case TransactionType.CHANGE_HANDLE:
    case TransactionType.CREATE_HANDLE:
      requiredFields.push('handle');
      break;

    case TransactionType.RETIRE_MSA:
      break;

    case TransactionType.REVOKE_DELEGATION:
      break;

    case TransactionType.SIWF_SIGNUP:
      requiredFields.push('handle', 'accountId');
      logger.debug(`Received account signup response for referenceId ${referenceId}`, payload as SIWFWebhookRsp);

      sseManager.broadcast('account_created', payload);
      break;

    default:
      throw new HttpError(HttpStatusCode.BadRequest, `Unknown transaction type ${transactionType}`);
  }

  const missingFields: string[] = [];
  requiredFields.forEach((field) => {
    if (!Object.keys(payload).some((key) => key === field)) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    throw new HttpError(HttpStatusCode.BadRequest, `Missing required fields: ${missingFields}`);
  }

  referenceIdsReceived.set(referenceId, payload);
  logger.debug(`WebhookController:authServiceWebhook: received referenceId: ${referenceId}`);
  return HttpStatusCode.Created;
}
